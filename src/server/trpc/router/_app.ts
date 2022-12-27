import userRouter from "@/server/user/user.routes";
import { rootRouter } from "../trpc";
import authRouter from "@/server/user/auth.routes";
export const appRouter = rootRouter({
  user: userRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
