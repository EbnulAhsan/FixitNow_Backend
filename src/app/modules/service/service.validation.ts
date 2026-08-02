import { z } from "zod";

const createServiceValidationSchema = z.object({
    body: z
        .object({
            title: z
                .string({
                    error: "Service title must be a string",
                })
                .trim()
                .min(3, {
                    message:
                        "Service title must be at least 3 characters",
                })
                .max(150, {
                    message:
                        "Service title cannot exceed 150 characters",
                }),

            description: z
                .string({
                    error: "Service description must be a string",
                })
                .trim()
                .min(10, {
                    message:
                        "Service description must be at least 10 characters",
                })
                .max(2000, {
                    message:
                        "Service description cannot exceed 2000 characters",
                }),

            price: z
                .number({
                    error: "Service price must be a number",
                })
                .positive({
                    message:
                        "Service price must be greater than 0",
                })
                .max(1000000, {
                    message: "Service price is too large",
                }),

            categoryId: z.uuid({
                error: "Category ID must be a valid UUID",
            }),
        })
        .strict(),
});


const getAllServicesValidationSchema = z.object({
    query: z
        .object({
            searchTerm: z.string().min(1).optional(),

            categoryId: z
                .string()
                .uuid("Invalid category ID")
                .optional(),

            minPrice: z.coerce
                .number()
                .min(0, "Minimum price cannot be negative")
                .optional(),

            maxPrice: z.coerce
                .number()
                .min(0, "Maximum price cannot be negative")
                .optional(),
        })
        .refine(
            (data) =>
                data.minPrice === undefined ||
                data.maxPrice === undefined ||
                data.minPrice <= data.maxPrice,
            {
                message:
                    "Minimum price cannot be greater than maximum price",
                path: ["minPrice"],
            }
        )
        .default({}),
});


// update service endpoint for technician
const updateServiceValidationSchema = z.object({
    params: z.object({
        id: z.uuid({
            error: "Service ID must be a valid UUID",
        }),
    }),

    body: z
        .object({
            title: z
                .string({
                    error: "Service title must be a string",
                })
                .trim()
                .min(3, {
                    message:
                        "Service title must be at least 3 characters",
                })
                .max(150, {
                    message:
                        "Service title cannot exceed 150 characters",
                })
                .optional(),

            description: z
                .string({
                    error: "Service description must be a string",
                })
                .trim()
                .min(10, {
                    message:
                        "Service description must be at least 10 characters",
                })
                .max(2000, {
                    message:
                        "Service description cannot exceed 2000 characters",
                })
                .optional(),

            price: z
                .number({
                    error: "Service price must be a number",
                })
                .positive({
                    message:
                        "Service price must be greater than 0",
                })
                .max(1000000, {
                    message: "Service price is too large",
                })
                .optional(),

            categoryId: z
                .uuid({
                    error:
                        "Category ID must be a valid UUID",
                })
                .optional(),
        })
        .strict()
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message:
                    "At least one field is required to update service",
            }
        ),
});


// Service ID parameter validation
const serviceIdParamsValidationSchema = z.object({
    params: z.object({
        id: z.string().uuid({
            message: "Service ID must be a valid UUID",
        }),
    }),
});





export const ServiceValidation = {
    createServiceValidationSchema,
    getAllServicesValidationSchema,
    updateServiceValidationSchema,
    serviceIdParamsValidationSchema
};

