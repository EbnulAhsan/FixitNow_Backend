import { z } from "zod";

const getAllUsersValidationSchema = z.object({
    query: z.object({
        searchTerm: z.string().trim().optional(),

        role: z
            .enum(["CUSTOMER", "TECHNICIAN", "ADMIN"], {
                error: "Invalid user role",
            })
            .optional(),

        isBlocked: z
            .enum(["true", "false"], {
                error: "isBlocked must be true or false",
            })
            .optional(),

        isDeleted: z
            .enum(["true", "false"], {
                error: "isDeleted must be true or false",
            })
            .optional(),
    }),
});


const userIdParamsValidationSchema = z.object({
    params: z.object({
        id: z.uuid({
            error: "User ID must be a valid UUID",
        }),
    }),
});

export const AdminValidation = {
    getAllUsersValidationSchema,
    userIdParamsValidationSchema
};