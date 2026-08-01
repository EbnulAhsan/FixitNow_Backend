import { AppError } from "../../utils/appError";
import prisma from "../../utils/prisma";

type TCreateBookingPayload = {
    serviceId: string;
    bookingDate: string;
};

const createBookingIntoDB = async (
    customerId: string,
    payload: TCreateBookingPayload
) => {
    const customer = await prisma.user.findUnique({
        where: {
            id: customerId,
        },
    });

    if (!customer) {
        throw new AppError(404, "Customer not found");
    }

    if (customer.role !== "CUSTOMER") {
        throw new AppError(
            403,
            "Only customers can create bookings"
        );
    }

    const service = await prisma.service.findUnique({
        where: {
            id: payload.serviceId,
        },
    });

    if (!service) {
        throw new AppError(404, "Service not found");
    }

    const result = await prisma.booking.create({
        data: {
            customerId,
            serviceId: payload.serviceId,
            bookingDate: new Date(payload.bookingDate),
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            service: {
                include: {
                    category: true,
                    technician: true,
                },
            },
        },
    });

    return result;
};



const getMyBookingsFromDB = async (customerId: string) => {
    const result = await prisma.booking.findMany({
        where: {
            customerId,
        },
        include: {
            service: {
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
                                    profilePhoto: true,
                                },
                            },
                        },
                    },
                },
            },
            payment: true,
            review: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

// for technician booking 
const getTechnicianBookingsFromDB = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId,
        },
    });

    if (!technician) {
        throw new AppError(404, "Technician profile not found");
    }

    const result = await prisma.booking.findMany({
        where: {
            service: {
                technicianId: technician.id,
            },
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    profilePhoto: true,
                },
            },
            service: {
                include: {
                    category: true,
                },
            },
            payment: true,
            review: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};











export const BookingServices = {
    createBookingIntoDB,
    getMyBookingsFromDB,
    getTechnicianBookingsFromDB
};