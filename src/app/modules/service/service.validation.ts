import { z } from "zod";

const createServiceValidationSchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(1, "Service title is required"),

        description: z
            .string()
            .min(1, "Service description is required"),

        price: z
            .number()
            .positive("Service price must be greater than 0"),

        categoryId: z
            .string()
            .uuid("Invalid category ID"),
    }),
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
    body: z
        .object({
            title: z
                .string()
                .min(3, "Title must be at least 3 characters")
                .optional(),

            description: z
                .string()
                .min(10, "Description must be at least 10 characters")
                .optional(),

            price: z
                .number()
                .positive("Price must be greater than 0")
                .optional(),

            categoryId: z
                .string()
                .uuid("Invalid category ID")
                .optional(),
        })
        .refine(
            (data) => Object.keys(data).length > 0,
            {
                message: "At least one field is required to update service",
            }
        ),

    params: z.object({
        id: z.string().uuid("Invalid service ID"),
    }),
});





export const ServiceValidation = {
    createServiceValidationSchema,
    getAllServicesValidationSchema,
    updateServiceValidationSchema
};

