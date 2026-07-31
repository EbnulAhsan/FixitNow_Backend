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
    });

    if (!user) {
        throw new Error("User not found please create one ");
    }

    if (user.role !== "TECHNICIAN") {
        throw new Error(
            "Only technicians can create or update a technician profile, others will not ."
        );
    }

    const result = await prisma.technicianProfile.upsert({
        where: {
            userId,
        },
        update: payload,
        create: {
            ...payload,
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
