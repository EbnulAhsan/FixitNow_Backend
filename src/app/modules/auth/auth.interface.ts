import { Role } from "@prisma/client";

export type TRegisterUser = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    profilePhoto?: string;
    role: Role;
};