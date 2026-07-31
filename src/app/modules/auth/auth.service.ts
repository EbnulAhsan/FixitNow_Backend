import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import config from "../../config";

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

export const AuthServices = {
    registerUser,
};