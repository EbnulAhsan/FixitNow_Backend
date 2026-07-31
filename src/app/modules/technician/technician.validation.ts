import { z } from "zod";

const upsertTechnicianProfileValidationSchema = z.object({
    body: z.object({
        bio: z
            .string()
            .min(1, "Bio cannot be empty")
            .optional(),

        skills: z
            .array(z.string().min(1, "Skill cannot be empty"))
            .min(1, "At least one skill is required"),

        experience: z
            .number()
            .int("Experience must be an integer")
            .min(0, "Experience cannot be negative"),

        hourlyRate: z
            .number()
            .positive("Hourly rate must be greater than 0"),
    }),
});

export const TechnicianValidation = {
    upsertTechnicianProfileValidationSchema,
};