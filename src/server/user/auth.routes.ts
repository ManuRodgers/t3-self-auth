import { publicProcedure, rootRouter } from "../trpc/trpc";
import {
  registerUserHandler,
  loginUserHandler,
  logoutHandler,
  refreshAccessTokenHandler,
} from "./auth.controller";
import { registerUserSchema, loginUserSchema } from "./user.schema";

const authRouter = rootRouter({
  registerUser: publicProcedure
    .input(registerUserSchema)
    .mutation(({ input }) => registerUserHandler({ input })),
  loginUser: publicProcedure
    .input(loginUserSchema)
    .mutation(({ input, ctx }) => loginUserHandler({ input, ctx })),
  logoutUser: publicProcedure.mutation(({ ctx }) => logoutHandler({ ctx })),
  refreshAccessToken: publicProcedure.query(({ ctx }) =>
    refreshAccessTokenHandler({ ctx })
  ),
});

export default authRouter;
