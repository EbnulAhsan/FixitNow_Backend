import prisma from "../../utils/prisma";
import { TService } from "./service.interface";

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

export const ServiceServices = {
    createService,
};