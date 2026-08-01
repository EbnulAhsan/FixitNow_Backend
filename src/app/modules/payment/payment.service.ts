

// payment service

import prisma from "../../utils/prisma";
import { AppError } from "../../utils/appError";
import stripe from "../../utils/stripe";

type TCreatePaymentIntentPayload = {
    bookingId: string;
};

const createPaymentIntentIntoDB = async (
    customerId: string,
    payload: TCreatePaymentIntentPayload
) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: payload.bookingId,
        },
        include: {
            service: true,
            payment: true,
        },
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    // Only the booking owner can initiate payment
    if (booking.customerId !== customerId) {
        throw new AppError(
            403,
            "You are not authorized to pay for this booking"
        );
    }

    // Payment is allowed only after the technician accepts the booking
    if (booking.status !== "ACCEPTED") {
        throw new AppError(
            400,
            `Payment cannot be initiated for booking with status ${booking.status}`
        );
    }

    // Handle an existing payment record
    if (booking.payment) {
        // Completed payment must not be paid again
        if (booking.payment.status === "COMPLETED") {
            throw new AppError(
                400,
                "Payment has already been completed for this booking"
            );
        }

        // Reuse the existing pending PaymentIntent
        if (booking.payment.status === "PENDING") {
            const existingPaymentIntent =
                await stripe.paymentIntents.retrieve(
                    booking.payment.transactionId
                );

            if (!existingPaymentIntent.client_secret) {
                throw new AppError(
                    500,
                    "Existing Stripe payment intent has no client secret"
                );
            }

            return {
                paymentId: booking.payment.id,
                transactionId: booking.payment.transactionId,
                clientSecret: existingPaymentIntent.client_secret,
                amount: booking.payment.amount,
                currency: existingPaymentIntent.currency,
                status: booking.payment.status,
            };
        }

        // Create a new PaymentIntent after a failed attempt
        if (booking.payment.status === "FAILED") {
            const retryPaymentIntent =
                await stripe.paymentIntents.create({
                    amount: Math.round(booking.service.price * 100),
                    currency: "bdt",
                    automatic_payment_methods: {
                        enabled: true,
                    },
                    metadata: {
                        bookingId: booking.id,
                        customerId,
                        serviceId: booking.serviceId,
                    },
                });

            if (!retryPaymentIntent.client_secret) {
                throw new AppError(
                    500,
                    "Unable to create Stripe payment intent"
                );
            }

            const updatedPayment = await prisma.payment.update({
                where: {
                    id: booking.payment.id,
                },
                data: {
                    transactionId: retryPaymentIntent.id,
                    amount: booking.service.price,
                    provider: "STRIPE",
                    status: "PENDING",
                    paidAt: null,
                },
            });

            return {
                paymentId: updatedPayment.id,
                transactionId: updatedPayment.transactionId,
                clientSecret: retryPaymentIntent.client_secret,
                amount: updatedPayment.amount,
                currency: retryPaymentIntent.currency,
                status: updatedPayment.status,
            };
        }
    }

    // Stripe expects the amount in the smallest currency unit
    const stripeAmount = Math.round(
        booking.service.price * 100
    );

    const paymentIntent = await stripe.paymentIntents.create(
        {
            amount: stripeAmount,
            currency: "bdt",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                bookingId: booking.id,
                customerId,
                serviceId: booking.serviceId,
            },
        },
        {
            idempotencyKey: `booking-payment-${booking.id}`,
        }
    );

    if (!paymentIntent.client_secret) {
        throw new AppError(
            500,
            "Unable to create Stripe payment intent"
        );
    }

    const payment = await prisma.payment.create({
        data: {
            bookingId: booking.id,
            transactionId: paymentIntent.id,
            amount: booking.service.price,
            provider: "STRIPE",
            status: "PENDING",
        },
    });

    return {
        paymentId: payment.id,
        transactionId: payment.transactionId,
        clientSecret: paymentIntent.client_secret,
        amount: payment.amount,
        currency: paymentIntent.currency,
        status: payment.status,
    };
};

// complete payment status

const completePaymentIntoDB = async (
    paymentIntentId: string,
    amountReceived: number,
    currency: string
) => {
    const payment = await prisma.payment.findUnique({
        where: {
            transactionId: paymentIntentId,
        },
        include: {
            booking: {
                include: {
                    service: true,
                },
            },
        },
    });

    if (!payment) {
        throw new AppError(404, "Payment record not found");
    }


    if (payment.status === "COMPLETED") {
        return payment;
    }

    if (payment.status === "FAILED") {
        throw new AppError(
            400,
            "Failed payment cannot be marked as completed"
        );
    }

    const expectedAmount = Math.round(payment.amount * 100);

    if (amountReceived !== expectedAmount) {
        throw new AppError(
            400,
            "Stripe payment amount does not match the booking amount"
        );
    }

    if (currency.toLowerCase() !== "bdt") {
        throw new AppError(
            400,
            "Stripe payment currency does not match"
        );
    }

    if (payment.booking.status !== "ACCEPTED") {
        throw new AppError(
            400,
            `Payment cannot be completed for booking with status ${payment.booking.status}`
        );
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const updatedPayment = await transactionClient.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: "COMPLETED",
                paidAt: new Date(),
            },
        });

        await transactionClient.booking.update({
            where: {
                id: payment.bookingId,
            },
            data: {
                status: "PAID",
            },
        });

        return updatedPayment;
    });

    return result;
};

// failed payment status 
const failPaymentIntoDB = async (
    paymentIntentId: string
) => {
    const payment = await prisma.payment.findUnique({
        where: {
            transactionId: paymentIntentId,
        },
        include: {
            booking: true,
        },
    });

    if (!payment) {
        throw new AppError(404, "Payment record not found");
    }


    if (payment.status === "FAILED") {
        return payment;
    }


    if (payment.status === "COMPLETED") {
        return payment;
    }

    const result = await prisma.payment.update({
        where: {
            id: payment.id,
        },
        data: {
            status: "FAILED",
            paidAt: null,
        },
    });

    return result;
};

// get my payment status

const getMyPaymentsFromDB = async (
    customerId: string
) => {
    const result = await prisma.payment.findMany({
        where: {
            booking: {
                customerId,
            },
        },
        include: {
            booking: {
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
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};





export const PaymentServices = {
    createPaymentIntentIntoDB,
    completePaymentIntoDB,
    failPaymentIntoDB,
    getMyPaymentsFromDB
};