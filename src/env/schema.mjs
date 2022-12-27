// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  // app
  NODE_ENV: z.enum(["development", "test", "production"]),
  // postgres
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  DATABASE_PORT: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_HOSTNAME: z.string(),
  // Redis
  REDIS_URL: z.string(),
  // prisma
  DATABASE_URL: z.string().url(),
  SHADOW_DATABASE_URL: z.string().url(),
  // access token
  ACCESS_TOKEN_PRIVATE_KEY: z.string(),
  ACCESS_TOKEN_PUBLIC_KEY: z.string(),
  // refresh token
  REFRESH_TOKEN_PRIVATE_KEY: z.string(),
  REFRESH_TOKEN_PUBLIC_KEY: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_TRPC_ENDPOINT: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_TRPC_ENDPOINT: process.env.NEXT_PUBLIC_TRPC_ENDPOINT,
};
