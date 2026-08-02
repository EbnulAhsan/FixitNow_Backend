import { z } from "zod";

const registerValidationSchema = z.object({
    body: z
        .object({
            name: z
                .string()
                .trim()
                .min(2, {
                    message: "Name must be at least 2 characters",
                })
                .max(100, {
                    message: "Name cannot exceed 100 characters",
                }),

            email: z
                .string()
                .trim()
                .toLowerCase()
                .email({
                    message: "Invalid email address",
                }),

            password: z
                .string()
                .min(8, {
                    message: "Password must be at least 8 characters",
                })
                .max(72, {
                    message: "Password cannot exceed 72 characters",
                })
                .regex(/[a-z]/, {
                    message: "Password must contain a lowercase letter",
                })
                .regex(/[A-Z]/, {
                    message: "Password must contain an uppercase letter",
                })
                .regex(/[0-9]/, {
                    message: "Password must contain a number",
                }),

            role: z.enum(
                ["CUSTOMER", "TECHNICIAN"],
                {
                    error: "Role must be CUSTOMER or TECHNICIAN",
                }
            ),

            phone: z
                .string()
                .trim()
                .regex(/^01\d{9}$/, {
                    message:
                        "Phone number must be 11 digits and start with 01",
                })
                .optional(),

            address: z
                .string()
                .trim()
                .min(3, {
                    message: "Address must be at least 3 characters",
                })
                .max(255, {
                    message: "Address cannot exceed 255 characters",
                })
                .optional(),

            profilePhoto: z
                .string()
                .trim()
                .url({
                    message: "Profile photo must be a valid URL",
                })
                .optional(),
        })
        .strict(),
});

const loginValidationSchema = z.object({
    body: z
        .object({
            email: z
                .string()
                .trim()
                .toLowerCase()
                .email({
                    message: "Invalid email address",
                }),

            password: z
                .string()
                .min(1, {
                    message: "Password is required",
                }),
        })
        .strict(),
});

export const AuthValidation = {
    registerValidationSchema,
    loginValidationSchema,
};