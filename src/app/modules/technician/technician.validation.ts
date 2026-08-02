import { z } from "zod";

const upsertTechnicianProfileValidationSchema = z.object({
    body: z
        .object({
            bio: z
                .string()
                .trim()
                .min(1, {
                    message: "Bio cannot be empty",
                })
                .max(1000, {
                    message:
                        "Bio cannot exceed 1000 characters",
                })
                .optional(),

            skills: z
                .array(
                    z
                        .string()
                        .trim()
                        .min(1, {
                            message:
                                "Skill cannot be empty",
                        })
                        .max(100, {
                            message:
                                "Each skill cannot exceed 100 characters",
                        })
                )
                .min(1, {
                    message:
                        "At least one skill is required",
                })
                .max(20, {
                    message:
                        "A maximum of 20 skills is allowed",
                })
                .refine(
                    (skills) => {
                        const normalizedSkills = skills.map(
                            (skill) =>
                                skill.trim().toLowerCase()
                        );

                        return (
                            new Set(normalizedSkills).size ===
                            normalizedSkills.length
                        );
                    },
                    {
                        message:
                            "Duplicate skills are not allowed",
                    }
                ),

            experience: z
                .number({
                    error:
                        "Experience must be a number",
                })
                .int({
                    message:
                        "Experience must be an integer",
                })
                .min(0, {
                    message:
                        "Experience cannot be negative",
                })
                .max(80, {
                    message:
                        "Experience cannot exceed 80 years",
                }),

            hourlyRate: z
                .number({
                    error:
                        "Hourly rate must be a number",
                })
                .positive({
                    message:
                        "Hourly rate must be greater than 0",
                })
                .max(1000000, {
                    message:
                        "Hourly rate is too large",
                }),
        })
        .strict(),
});

export const TechnicianValidation = {
    upsertTechnicianProfileValidationSchema,
};