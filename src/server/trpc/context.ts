import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "../db/prisma";
import { deserializeUser } from "../utils/deserializeUser";

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
// interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {}

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async () => {
  return {
    prisma,
  };
};

/**
 *  @description The createContext function is called for each incoming request,
 *  so here you can add contextual information about the calling user from the request object.
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  console.log("createContext: ");
  const contextInner = await createContextInner();
  const { user } = await deserializeUser({ req, res });
  return {
    ...contextInner,
    req,
    res,
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
