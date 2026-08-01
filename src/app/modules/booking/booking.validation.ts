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


// update booking validation
const updateBookingStatusValidationSchema = z.object({
    params: z.object({
        id: z.uuid({
            error: "Booking ID must be a valid UUID",
        }),
    }),

    body: z.object({
        status: z.enum(
            [
                "ACCEPTED",
                "DECLINED",
                "IN_PROGRESS",
                "COMPLETED",
            ],
            {
                error: "Invalid booking status",
            }
        ),
    }),
});

// cancel booking validations
const cancelBookingValidationSchema = z.object({
    params: z.object({
        id: z.uuid({
            error: "Booking ID must be a valid UUID",
        }),
    }),
});

export const BookingValidation = {
    createBookingValidationSchema,
    updateBookingStatusValidationSchema,
    cancelBookingValidationSchema
};