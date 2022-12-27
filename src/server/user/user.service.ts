import type { Prisma, User } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import redis from "@/server/db/redis";
import { config } from "../config/default";
import { signJwt } from "../utils/jwt";

export const createUser = async (
  input: Prisma.UserCreateInput
): Promise<User> => (await prisma.user.create({ data: input })) as User;

export const findUser = async (
  where: Partial<Prisma.UserCreateInput>,
  select?: Prisma.UserSelect
): Promise<User> =>
  (await prisma.user.findFirst({
    where,
    select,
  })) as User;

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
): Promise<User> =>
  (await prisma.user.findUnique({
    where,
    select,
  })) as User;

export const updateUser = async (
  where: Partial<Prisma.UserWhereUniqueInput>,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect
): Promise<User> =>
  (await prisma.user.update({
    where,
    data,
    select,
  })) as User;

export const signTokens = async (
  user: Prisma.UserCreateInput
): Promise<{ accessToken: string; refreshToken: string }> => {
  // 1. Create session in redis
  await redis.set(
    `${user.id}`,
    JSON.stringify(user),
    "EX",
    config.redisCacheExpiresIn * 60
  );
  // 2. Create access token and refresh token

  const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.accessTokenExpiresIn}m`,
  });
  const refreshToken = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.refreshTokenExpiresIn}m`,
  });

  return { accessToken, refreshToken };
};
