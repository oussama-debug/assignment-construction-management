import { createTRPCRouter } from "./trpc";
import { workerRouter } from "./routers/worker";
import { siteRouter } from "./routers/site";

export const appRouter = createTRPCRouter({
  worker: workerRouter,
  site: siteRouter,
});

export type AppRouter = typeof appRouter;
