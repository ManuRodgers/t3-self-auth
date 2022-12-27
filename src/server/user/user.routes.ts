import { protectProcedure, rootRouter } from "../trpc/trpc";
import { getMeHandler } from "./user.controller";

const userRouter = rootRouter({
  getMe: protectProcedure.query(({ ctx }) => getMeHandler({ ctx })),
});

export default userRouter;
