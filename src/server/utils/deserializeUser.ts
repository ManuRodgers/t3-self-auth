import { TRPCError } from "@trpc/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyJwt } from "./jwt";
import redis from "../db/redis";
import { findUniqueUser } from "../user/user.service";

export const deserializeUser = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  try {
    let accessToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      accessToken = req.cookies.access_token;
    }
    const notAuthenticated = {
      req,
      res,
      user: null,
    };
    if (!accessToken) {
      return notAuthenticated;
    }
    // validate access token
    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey"
    );
    if (!decoded) {
      return notAuthenticated;
    }
    // check if user has a valid session in redis
    // check if the user has a valid session
    const session = await redis.get(decoded.sub);
    if (!session) {
      return notAuthenticated;
    }
    // check if user still exists in database
    const user = await findUniqueUser({ id: JSON.parse(session).id });
    if (!user) {
      return notAuthenticated;
    }
    return {
      req,
      res,
      user,
    };
  } catch (error: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
};
