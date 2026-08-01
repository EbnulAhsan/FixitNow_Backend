

// payment validation

import { z } from "zod";

const createPaymentIntentValidationSchema = z.object({
    body: z.object({
        bookingId: z.uuid({
            error: "Booking ID must be a valid UUID",
        }),
    }),
});

export const PaymentValidation = {
    createPaymentIntentValidationSchema,
};