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


// single booking validation
const getSingleBookingValidationSchema = z.object({
    params: z.object({
        id: z.uuid({
            error: "Booking ID must be a valid UUID",
        }),
    }),
});


// Admin get all bookings query validation
const getAllBookingsForAdminValidationSchema = z.object({
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
                    "REQUESTED",
                    "ACCEPTED",
                    "DECLINED",
                    "PAID",
                    "IN_PROGRESS",
                    "COMPLETED",
                    "CANCELLED",
                ],
                {
                    error: "Invalid booking status",
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




export const BookingValidation = {
    createBookingValidationSchema,
    updateBookingStatusValidationSchema,
    cancelBookingValidationSchema,
    getSingleBookingValidationSchema,
    getAllBookingsForAdminValidationSchema
};