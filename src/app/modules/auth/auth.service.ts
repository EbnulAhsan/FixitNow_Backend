import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import config from "../../config";
import jwt from "jsonwebtoken";

const registerUser = async (payload: any) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number(config.bcrypt_salt_rounds)
    );
    const result = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword,
        },
    });

    const { password, ...userData } = result;

    return userData;
};

// login user 
const loginUser = async (payload: {
    email: string;
    password: string;
}) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        config.jwt_access_secret as string,
        {
            expiresIn: "7d",
        }
    );

    return {
        accessToken,
    };
};

//get me added 
const getMe = async (email: string) => {
    const result = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!result) {
        throw new Error("User not found");
    }

    const { password, ...userData } = result;

    return userData;
};








export const AuthServices = {
    registerUser,
    loginUser,
    getMe
};