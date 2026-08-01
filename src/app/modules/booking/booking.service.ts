import { AppError } from "../../utils/appError";
import prisma from "../../utils/prisma";

type TCreateBookingPayload = {
    serviceId: string;
    bookingDate: string;
};

type TUpdateBookingStatusPayload = {
    status: | "ACCEPTED"

    | "DECLINED"

    | "IN_PROGRESS"

    | "COMPLETED";
}



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


// update booking status

const updateBookingStatusIntoDB = async (
    bookingId: string,
    userId: string,
    payload: TUpdateBookingStatusPayload
) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId,
        },
    });

    if (!technician) {
        throw new AppError(404, "Technician profile not found");
    }

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            service: true,
        },
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.service.technicianId !== technician.id) {
        throw new AppError(
            403,
            "You are not authorized to update this booking"
        );
    }

    const allowedTransitions: Record<string, string[]> = {
        REQUESTED: ["ACCEPTED", "DECLINED"],
        PAID: ["IN_PROGRESS"],
        IN_PROGRESS: ["COMPLETED"],
    };

    const allowedNextStatuses =
        allowedTransitions[booking.status] || [];

    if (!allowedNextStatuses.includes(payload.status)) {
        throw new AppError(
            400,
            `Booking status cannot be changed from ${booking.status} to ${payload.status}`
        );
    }

    const result = await prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: payload.status,
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
    });

    return result;
};

// cancel booking status 

const cancelBookingIntoDB = async (
    bookingId: string,
    customerId: string
) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            service: {
                include: {
                    category: true,
                    technician: true,
                },
            },
        },
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    // Ensure the logged-in customer owns the booking
    if (booking.customerId !== customerId) {
        throw new AppError(
            403,
            "You are not authorized to cancel this booking"
        );
    }

    // Only REQUESTED or ACCEPTED bookings can be cancelled
    const cancellableStatuses = ["REQUESTED", "ACCEPTED"];

    if (!cancellableStatuses.includes(booking.status)) {
        throw new AppError(
            400,
            `Booking with status ${booking.status} cannot be cancelled`
        );
    }

    const result = await prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: "CANCELLED",
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
    });

    return result;
};









export const BookingServices = {
    createBookingIntoDB,
    getMyBookingsFromDB,
    getTechnicianBookingsFromDB,
    updateBookingStatusIntoDB,
    cancelBookingIntoDB
};