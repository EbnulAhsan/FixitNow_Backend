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

export const ServiceValidation = {
    createServiceValidationSchema,
};
