import { z } from "zod";


//  register validation schema
const registerValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),

        email: z.string().email("Invalid email"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),

        role: z.enum(["CUSTOMER", "TECHNICIAN"]),

        phone: z.string().min(11).optional(),

        address: z.string().optional(),

        profilePhoto: z.string().url().optional(),
    }),
});


// login validation schema
const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),
    }),
});



export const AuthValidation = {
    registerValidationSchema,
    loginValidationSchema
};