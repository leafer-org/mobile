import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  EXPO_PUBLIC_API_BASE_URL: z.string(),
  EXPO_PUBLIC_CENTRIFUGO_WS_URL: z.string().optional(),
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_CENTRIFUGO_WS_URL: process.env.EXPO_PUBLIC_CENTRIFUGO_WS_URL,
});
