import { z } from "zod";

const createReviewValidationSchema = z.object({
    body: z.object({
        bookingId: z.uuid({
            error: "Booking ID must be a valid UUID",
        }),

        rating: z
            .number({
                error: "Rating must be a number",
            })
            .int("Rating must be an integer")
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot be greater than 5"),

        comment: z
            .string({
                error: "Comment must be a string",
            })
            .trim()
            .min(3, "Comment must be at least 3 characters")
            .max(500, "Comment cannot exceed 500 characters")
            .optional(),
    }),
});


// get technician reviews validation
const getTechnicianReviewsValidationSchema = z.object({
    params: z.object({
        technicianId: z.uuid({
            error: "Technician ID must be a valid UUID",
        }),
    }),
});

export const ReviewValidation = {
    createReviewValidationSchema,
    getTechnicianReviewsValidationSchema
};
