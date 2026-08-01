import { Prisma, Role } from "@prisma/client";
import prisma from "../../utils/prisma";
import { AppError } from "../../utils/appError";

type TGetAllUsersQuery = {
    searchTerm?: string;
    role?: Role;
    isBlocked?: string;
    isDeleted?: string;
};

const getAllUsersFromDB = async (
    query: TGetAllUsersQuery
) => {
    const {
        searchTerm,
        role,
        isBlocked,
        isDeleted,
    } = query;

    const conditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        conditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    if (role) {
        conditions.push({
            role,
        });
    }

    if (isBlocked !== undefined) {
        conditions.push({
            isBlocked: isBlocked === "true",
        });
    }

    if (isDeleted !== undefined) {
        conditions.push({
            isDeleted: isDeleted === "true",
        });
    }

    const result = await prisma.user.findMany({
        where:
            conditions.length > 0
                ? {
                    AND: conditions,
                }
                : undefined,

        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            profilePhoto: true,
            role: true,
            isBlocked: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,

            technicianProfile: {
                select: {
                    id: true,
                    bio: true,
                    skills: true,
                    experience: true,
                    hourlyRate: true,
                },
            },

            _count: {
                select: {
                    bookings: true,
                    reviews: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};



const blockUserIntoDB = async (
    userId: string,
    adminId: string
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    // Admin cannot block their own account
    if (user.id === adminId) {
        throw new AppError(
            400,
            "You cannot block your own admin account"
        );
    }

    // One admin cannot block another admin
    if (user.role === "ADMIN") {
        throw new AppError(
            403,
            "Admin accounts cannot be blocked"
        );
    }

    // Deleted users cannot be blocked
    if (user.isDeleted) {
        throw new AppError(
            400,
            "Deleted user cannot be blocked"
        );
    }

    // Prevent repeated block operation
    if (user.isBlocked) {
        throw new AppError(
            400,
            "User is already blocked"
        );
    }

    const result = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isBlocked: true,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isBlocked: true,
            isDeleted: true,
            updatedAt: true,
        },
    });

    return result;
};

export const AdminServices = {
    getAllUsersFromDB,
    blockUserIntoDB
};