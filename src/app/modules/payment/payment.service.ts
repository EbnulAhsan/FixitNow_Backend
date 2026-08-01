

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

    // Only the booking owner can initiate payment and othes will not able to do that 
    if (booking.customerId !== customerId) {
        throw new AppError(
            403,
            "You are not authorized to pay for this booking"
        );
    }

    // Payment is allowed only after technician accepts the booking otherwise its not working 
    if (booking.status !== "ACCEPTED") {
        throw new AppError(
            400,
            `Payment cannot be initiated for booking with status ${booking.status}`
        );
    }

    // Prevent duplicate payment records and charges perfectly
    if (booking.payment) {
        if (booking.payment.status === "COMPLETED") {
            throw new AppError(
                400,
                "Payment has already been completed for this booking"
            );
        }

        if (booking.payment.status === "PENDING") {
            const existingPaymentIntent =
                await stripe.paymentIntents.retrieve(
                    booking.payment.transactionId
                );

            return {
                paymentId: booking.payment.id,
                transactionId: booking.payment.transactionId,
                clientSecret: existingPaymentIntent.client_secret,
                amount: booking.payment.amount,
                currency: existingPaymentIntent.currency,
                status: booking.payment.status,
            };
        }

        throw new AppError(
            400,
            "The previous payment attempt failed"
        );
    }

    // Stripe expects two-decimal currencies in their smallest unit.
    const stripeAmount = Math.round(booking.service.price * 100);

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

export const PaymentServices = {
    createPaymentIntentIntoDB,
};