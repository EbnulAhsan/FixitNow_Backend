import { z } from "zod";

const createCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(1, {
                message: "Category name is required",
            }),

        description: z
            .string()
            .trim()
            .optional(),
    }),
});


// Update category validation
const updateCategoryValidationSchema = z.object({
    params: z.object({
        id: z.uuid({
            error: "Category ID must be a valid UUID",
        }),
    }),

    body: z
        .object({
            name: z
                .string()
                .trim()
                .min(1, {
                    message: "Category name cannot be empty",
                })
                .optional(),

            description: z
                .string()
                .trim()
                .optional(),
        })
        .refine(
            (body) =>
                body.name !== undefined ||
                body.description !== undefined,
            {
                message:
                    "At least one field is required to update category",
            }
        ),
});


// Delete category validation
const deleteCategoryValidationSchema = z.object({
    params: z.object({
        id: z.uuid({
            error: "Category ID must be a valid UUID",
        }),
    }),
});


export const CategoryValidation = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
    deleteCategoryValidationSchema,
};