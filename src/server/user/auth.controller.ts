// [...] Imports
import { env } from "@/env/server.mjs";
import { compare, hash } from "bcryptjs";
import type { OptionsType } from "cookies-next/lib/types";
import { config } from "../config/default";
import type { LoginUserInput, RegisterUserInput } from "./user.schema";
import {
  createUser,
  findUniqueUser,
  findUser,
  signTokens,
} from "./user.service";
import { TRPCError } from "@trpc/server";
import type { User } from "@prisma/client";
import { getCookie, setCookie } from "cookies-next";
import type { Context } from "../trpc/context";
import { verifyJwt } from "../utils/jwt";
import redis from "../db/redis";

// [...] Cookie options
const cookieOptions: OptionsType = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
};
const accessTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(Date.now() + config.accessTokenExpiresIn * 60 * 1000),
};
const refreshTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(Date.now() + config.refreshTokenExpiresIn * 60 * 1000),
};
// [...] Register user
export /**
 *
 *
 * @param {RegisterUserInput} {
 *   email,
 *   name,
 *   password,
 *   photo,
 * }
 * @return {*}
 */
const registerUserHandler = async ({
  input,
}: {
  input: RegisterUserInput;
}): Promise<{
  status: string;
  data: {
    user: User;
  };
}> => {
  const { email, name, password, photo } = input;
  try {
    const hashedPassword = await hash(password, 12);
    const user = await createUser({
      email,
      name,
      password: hashedPassword,
      photo,
      provider: "local",
    });
    return { status: "success", data: { user } };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "email already exists",
      });
    }
    throw error;
  }
};

// [...] Login user
export const loginUserHandler = async ({
  input,
  ctx: { req, res },
}: {
  input: LoginUserInput;
  ctx: Context;
}): Promise<{
  status: string;
  data: {
    accessToken: string;
  };
}> => {
  try {
    const { email, password } = input;

    // get the user from database
    const user = await findUser({ email });
    // check password
    const isPasswordMatch = await compare(password, user.password);
    if (!user || !isPasswordMatch) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Incorrect email or password",
      });
    }
    // create accessToken and refreshToken
    const { accessToken, refreshToken } = await signTokens(user);
    setCookie("accessToken", accessToken, {
      req,
      res,
      ...accessTokenCookieOptions,
    });
    setCookie("refreshToken", refreshToken, {
      req,
      res,
      ...refreshTokenCookieOptions,
    });
    setCookie("logged_in", "true", {
      req,
      res,
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    return { status: "success", data: { accessToken } };
  } catch (error) {
    throw error;
  }
};

// [...] Refresh tokens
export const refreshAccessTokenHandler = async ({
  ctx: { req, res },
}: {
  ctx: Context;
}): Promise<{
  status: string;
  data: {
    accessToken: string;
  };
}> => {
  try {
    // get the refresh token
    const refreshToken = getCookie("refreshToken", { req, res })?.toString();
    const message = "Could not refresh access token";
    if (!refreshToken) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }
    // validate the refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );
    if (!decoded) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message,
      });
    }
    // check if the user has a valid session
    const session = await redis.get(decoded.sub);
    if (!session) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message,
      });
    }
    // check if the user exists in the database
    const user = await findUniqueUser({ id: JSON.parse(session).id });
    if (!user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message,
      });
    }
    // create accessToken and refreshToken
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await signTokens(user);
    setCookie("accessToken", newAccessToken, {
      req,
      res,
      ...accessTokenCookieOptions,
    });
    setCookie("refreshToken", newRefreshToken, {
      req,
      res,
      ...refreshTokenCookieOptions,
    });
    setCookie("loggedIn", "true", {
      req,
      res,
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    return { status: "success", data: { accessToken: newAccessToken } };
  } catch (error) {
    throw error;
  }
};

export const logoutHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    const { user, req, res } = ctx;
    await redis.del(String(user?.id));
    setCookie("accessToken", "", {
      req,
      res,
      maxAge: -1,
    });
    setCookie("refreshToken", "", {
      req,
      res,
      maxAge: -1,
    });
    setCookie("loggedIn", "", {
      req,
      res,
      maxAge: -1,
    });
  } catch (error) {
    throw error;
  }
};
