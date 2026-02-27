import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  EXPO_PUBLIC_API_BASE_URL: z.string(),
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
});
