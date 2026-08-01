import { Prisma, Role } from "@prisma/client";
import prisma from "../../utils/prisma";

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

export const AdminServices = {
    getAllUsersFromDB,
};