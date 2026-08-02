

// payment validation

import { z } from "zod";

const createPaymentIntentValidationSchema = z.object({
    body: z.object({
        bookingId: z.uuid({
            error: "Booking ID must be a valid UUID",
        }),
    }),
});

// Admin get all payments query validation
const getAllPaymentsForAdminValidationSchema = z.object({
    query: z.object({
        searchTerm: z
            .string()
            .trim()
            .min(1, {
                message: "Search term cannot be empty",
            })
            .optional(),

        status: z
            .enum(
                [
                    "PENDING",
                    "COMPLETED",
                    "FAILED",
                ],
                {
                    error: "Invalid payment status",
                }
            )
            .optional(),

        provider: z
            .enum(
                ["STRIPE"],
                {
                    error: "Invalid payment provider",
                }
            )
            .optional(),

        page: z
            .string()
            .regex(/^[1-9]\d*$/, {
                message: "Page must be a positive integer",
            })
            .optional(),

        limit: z
            .string()
            .regex(/^[1-9]\d*$/, {
                message: "Limit must be a positive integer",
            })
            .refine(
                (value) => Number(value) <= 100,
                {
                    message: "Limit cannot be greater than 100",
                }
            )
            .optional(),
    }),
});





export const PaymentValidation = {
    createPaymentIntentValidationSchema,
    getAllPaymentsForAdminValidationSchema
};