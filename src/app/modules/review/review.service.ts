import prisma from "../../utils/prisma";
import { AppError } from "../../utils/appError";

type TCreateReviewPayload = {
    bookingId: string;
    rating: number;
    comment?: string;
};

const createReviewIntoDB = async (
    customerId: string,
    payload: TCreateReviewPayload
) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: payload.bookingId,
        },
        include: {
            service: true,
            payment: true,
            review: true,
        },
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    // Only the booking owner can submit a review
    if (booking.customerId !== customerId) {
        throw new AppError(
            403,
            "You are not authorized to review this booking"
        );
    }

    // Review is allowed only after service completion
    if (booking.status !== "COMPLETED") {
        throw new AppError(
            400,
            `Review cannot be submitted for booking with status ${booking.status}`
        );
    }

    // Ensure the booking has a completed payment
    if (
        !booking.payment ||
        booking.payment.status !== "COMPLETED"
    ) {
        throw new AppError(
            400,
            "Review cannot be submitted before payment is completed"
        );
    }

    // Prevent duplicate reviews for the same booking
    if (booking.review) {
        throw new AppError(
            409,
            "A review has already been submitted for this booking"
        );
    }

    const result = await prisma.review.create({
        data: {
            customerId,
            technicianId: booking.service.technicianId,
            bookingId: booking.id,
            rating: payload.rating,
            comment: payload.comment,
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    profilePhoto: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profilePhoto: true,
                        },
                    },
                },
            },
            booking: {
                include: {
                    service: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
    });

    return result;
};

export const ReviewServices = {
    createReviewIntoDB,
};