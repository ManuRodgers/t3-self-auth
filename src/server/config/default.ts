import { env } from "@/env/server.mjs";

const customConfig = {
  port: 8000,
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
  origin: "http://localhost:3000",
  redisCacheExpiresIn: 60,
  databaseUrl: env.DATABASE_URL,
  accessTokenPublicKey: env.ACCESS_TOKEN_PUBLIC_KEY,
  accessTokenPrivateKey: env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPublicKey: env.REFRESH_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: env.REFRESH_TOKEN_PRIVATE_KEY,
} as const;
export type CustomConfig = typeof customConfig;
export type PrivateKeys = Extract<
  keyof CustomConfig,
  "accessTokenPrivateKey" | "refreshTokenPrivateKey"
>;
export type PublicKeys = Extract<
  keyof CustomConfig,
  "accessTokenPublicKey" | "refreshTokenPublicKey"
>;

export const config = customConfig;
