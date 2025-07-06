import { createTRPCRouter, publicProcedure } from "../trpc";
import { workerService } from "../services/worker";
import {
  createWorkerSchema,
  checkInSchema,
  checkOutSchema,
  getActiveCheckInsSchema,
  getCheckInHistorySchema,
  getWorkerByIdSchema,
} from "../services/worker/validation";

export const workerRouter = createTRPCRouter({
  getWorkers: publicProcedure.query(async () => {
    return await workerService.getWorkers();
  }),

  getWorkerById: publicProcedure
    .input(getWorkerByIdSchema)
    .query(async ({ input }) => {
      return await workerService.getWorkerById(input.workerId);
    }),

  createWorker: publicProcedure
    .input(createWorkerSchema)
    .mutation(async ({ input }) => {
      return await workerService.createWorker(input);
    }),

  checkIn: publicProcedure.input(checkInSchema).mutation(async ({ input }) => {
    return await workerService.checkIn(
      input.workerId,
      input.siteId,
      input.notes
    );
  }),

  checkOut: publicProcedure
    .input(checkOutSchema)
    .mutation(async ({ input }) => {
      return await workerService.checkOut(input.workerId, input.notes);
    }),

  getActiveCheckIns: publicProcedure
    .input(getActiveCheckInsSchema)
    .query(async ({ input }) => {
      return await workerService.getActiveCheckIns(input.siteId);
    }),

  getCheckInHistory: publicProcedure
    .input(getCheckInHistorySchema)
    .query(async ({ input }) => {
      return await workerService.getCheckInHistory(
        input.workerId,
        input.siteId,
        input.limit
      );
    }),
});
