import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Valid email address required")
    .max(254)
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password must be at most 128 characters"),
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(100)
    .optional(),
});
