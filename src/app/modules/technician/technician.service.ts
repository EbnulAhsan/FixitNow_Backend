import { AppError } from "../../utils/appError";
import prisma from "../../utils/prisma";
import { TTechnicianProfile } from "./technician.interface";

const upsertTechnicianProfile = async (
    userId: string,
    payload: TTechnicianProfile
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
            "Only technicians can create or update a technician profile"
        );
    }

    const profileData = {
        bio: payload.bio?.trim() ?? "",
        skills: payload.skills,
        experience: payload.experience,
        hourlyRate: payload.hourlyRate,
    };

    const result = await prisma.technicianProfile.upsert({
        where: {
            userId,
        },
        update: profileData,
        create: {
            ...profileData,
            userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    profilePhoto: true,
                    role: true,
                },
            },
        },
    });

    return result;
};

export const TechnicianServices = {
    upsertTechnicianProfile,
};