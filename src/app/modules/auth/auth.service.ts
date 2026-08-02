import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";
import { AppError } from "../../utils/appError";
import prisma from "../../utils/prisma";

type TRegisterUserPayload = {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "TECHNICIAN";
    phone?: string;
    address?: string;
    profilePhoto?: string;
};

type TLoginUserPayload = {
    email: string;
    password: string;
};


// Register user
const registerUser = async (
    payload: TRegisterUserPayload
) => {
    const normalizedEmail =
        payload.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        throw new AppError(
            409,
            "User already exists with this email"
        );
    }

    const saltRounds = Number(
        config.bcrypt_salt_rounds
    );

    if (
        !Number.isInteger(saltRounds) ||
        saltRounds < 1
    ) {
        throw new AppError(
            500,
            "Invalid bcrypt configuration"
        );
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        saltRounds
    );

    const result = await prisma.user.create({
        data: {
            name: payload.name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: payload.role,
            phone: payload.phone?.trim(),
            address: payload.address?.trim(),
            profilePhoto: payload.profilePhoto?.trim(),
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            profilePhoto: true,
            role: true,
            isDeleted: true,
            isBlocked: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return result;
};


// Login user
const loginUser = async (
    payload: TLoginUserPayload
) => {
    const normalizedEmail =
        payload.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    
    if (!user) {
        throw new AppError(
            401,
            "Invalid email or password"
        );
    }

    if (user.isDeleted) {
        throw new AppError(
            403,
            "Your account has been deleted"
        );
    }

    if (user.isBlocked) {
        throw new AppError(
            403,
            "Your account has been blocked"
        );
    }

    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new AppError(
            401,
            "Invalid email or password"
        );
    }

    if (!config.jwt_access_secret) {
        throw new AppError(
            500,
            "JWT access secret is not configured"
        );
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        config.jwt_access_secret,
        {
            expiresIn: "7d",
        }
    );

    return {
        accessToken,
    };
};


// Get logged-in user
const getMe = async (email: string) => {
    const normalizedEmail =
        email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            profilePhoto: true,
            role: true,
            isDeleted: true,
            isBlocked: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new AppError(
            404,
            "User not found"
        );
    }

    if (user.isDeleted) {
        throw new AppError(
            403,
            "Your account has been deleted"
        );
    }

    if (user.isBlocked) {
        throw new AppError(
            403,
            "Your account has been blocked"
        );
    }

    return user;
};


export const AuthServices = {
    registerUser,
    loginUser,
    getMe,
};