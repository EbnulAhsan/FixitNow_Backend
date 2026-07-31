import { z } from "zod";

const registerValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),

        email: z.string().email("Invalid email"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),

        phone: z.string().optional(),

        address: z.string().optional(),

        profilePhoto: z.string().optional(),
    }),
});

export const AuthValidation = {
    registerValidationSchema,
};