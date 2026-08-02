import prisma from "../../utils/prisma";
import { TService } from "./service.interface";

import { AppError } from "../../utils/appError";

type TServiceQuery = {
    searchTerm?: string;
    categoryId?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
};

type TUpdateServicePayload = {
    title?: string;
    description?: string;
    price?: number;
    categoryId?: string;
};

const createService = async (
    userId: string,
    payload: TService
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            role: true,
            isBlocked: true,
            isDeleted: true,
            technicianProfile: {
                select: {
                    id: true,
                },
            },
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

    if (user.role !== "TECHNICIAN") {
        throw new AppError(
            403,
            "Only technicians can create services"
        );
    }

    if (!user.technicianProfile) {
        throw new AppError(
            404,
            "Technician profile not found. Please create a technician profile first"
        );
    }

    const category = await prisma.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });

    if (!category) {
        throw new AppError(
            404,
            "Category not found"
        );
    }

    const result = await prisma.service.create({
        data: {
            title: payload.title.trim(),
            description: payload.description.trim(),
            price: payload.price,
            categoryId: payload.categoryId,
            technicianId: user.technicianProfile.id,
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
    const searchTerm = query.searchTerm;
    const categoryId = query.categoryId;

    const minPrice =
        query.minPrice !== undefined
            ? Number(query.minPrice)
            : undefined;

    const maxPrice =
        query.maxPrice !== undefined
            ? Number(query.maxPrice)
            : undefined;

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



// get single service by id


const getSingleServiceFromDB = async (id: string) => {
    const result = await prisma.service.findUnique({
        where: {
            id,
        },

        include: {
            category: true,
            technician: true,
        }
    })
    if (!result) {
        throw new AppError(404, "Service not found");
    }

    return result;
};

// update service function
const updateServiceIntoDB = async (
    serviceId: string,
    userId: string,
    payload: TUpdateServicePayload
) => {
    // Check whether the service exists pr not 
    const existingService = await prisma.service.findUnique({
        where: {
            id: serviceId,
        },
        include: {
            technician: true,
        },
    });

    if (!existingService) {
        throw new AppError(404, "Service not found");
    }

    // Check whether the logged-in technician owns this service or not 
    if (existingService.technician.userId !== userId) {
        throw new AppError(
            403,
            "You are not authorized to update this service"
        );
    }

    // If categoryId is provided, check whether the category exists or not 
    if (payload.categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: payload.categoryId,
            },
        });

        if (!category) {
            throw new AppError(404, "Category not found");
        }
    }

    const result = await prisma.service.update({
        where: {
            id: serviceId,
        },
        data: payload,
        include: {
            category: true,
            technician: true,
        },
    });

    return result;
};


//  delete service function

const deleteServiceFromDB = async (
    serviceId: string,
    userId: string
) => {
    const existingService = await prisma.service.findUnique({
        where: {
            id: serviceId,
        },
        include: {
            technician: true,
            _count: {
                select: {
                    bookings: true,
                },
            },
        },
    });

    if (!existingService) {
        throw new AppError(
            404,
            "Service not found"
        );
    }

    if (existingService.technician.userId !== userId) {
        throw new AppError(
            403,
            "You are not authorized to delete this service"
        );
    }

    if (existingService._count.bookings > 0) {
        throw new AppError(
            409,
            "Service cannot be deleted because it has associated bookings"
        );
    }

    const result = await prisma.service.delete({
        where: {
            id: serviceId,
        },
    });

    return result;
};






export const ServiceServices = {
    createService,
    getAllServices,
    getSingleServiceFromDB,
    updateServiceIntoDB,
    deleteServiceFromDB
};