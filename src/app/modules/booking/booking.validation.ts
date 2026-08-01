import { z } from "zod";

const createBookingValidationSchema = z.object({
    body: z.object({
        serviceId: z.uuid({
            error: "Service ID must be a valid UUID",
        }),

        bookingDate: z
            .iso
            .datetime({
                error: "Booking date must be a valid ISO date",
            })
            .refine(
                (date) => new Date(date).getTime() > Date.now(),
                {
                    message: "Booking date must be in the future",
                }
            ),
    }),
});

export const BookingValidation = {
    createBookingValidationSchema,
};