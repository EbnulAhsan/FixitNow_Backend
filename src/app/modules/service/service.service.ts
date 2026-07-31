import prisma from "../../utils/prisma";
import { TService } from "./service.interface";

type TServiceQuery = {
    searchTerm?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
};

const createService = async (
    userId: string,
    payload: TService
) => {
    const technicianProfile =
        await prisma.technicianProfile.findUnique({
            where: {
                userId,
            },
        });

    if (!technicianProfile) {
        throw new Error("Technician profile not found");
    }

    const category = await prisma.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    const result = await prisma.service.create({
        data: {
            ...payload,
            technicianId: technicianProfile.id,
        },
        include: {
            category: true,
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            address: true,
                            profilePhoto: true,
                        },
                    },
                },
            },
        },
    });

    return result;
};

const getAllServices = async (query: TServiceQuery) => {
    const {
        searchTerm,
        categoryId,
        minPrice,
        maxPrice,
    } = query;

    const result = await prisma.service.findMany({
        where: {
            AND: [
                searchTerm
                    ? {
                        OR: [
                            {
                                title: {
                                    contains: searchTerm,
                                    mode: "insensitive",
                                },
                            },
                            {
                                description: {
                                    contains: searchTerm,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    }
                    : {},

                categoryId
                    ? {
                        categoryId,
                    }
                    : {},

                minPrice !== undefined ||
                    maxPrice !== undefined
                    ? {
                        price: {
                            ...(minPrice !== undefined && {
                                gte: minPrice,
                            }),
                            ...(maxPrice !== undefined && {
                                lte: maxPrice,
                            }),
                        },
                    }
                    : {},
            ],
        },
        include: {
            category: true,
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            address: true,
                            profilePhoto: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

export const ServiceServices = {
    createService,
    getAllServices,
};