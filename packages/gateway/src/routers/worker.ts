import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  supervisorProcedure,
} from "../trpc";
import { workerService } from "../services/worker";

export const workerRouter = createTRPCRouter({
  getWorkers: protectedProcedure.query(async () => {
    return await workerService.getWorkers();
  }),

  getWorkerById: protectedProcedure
    .input(z.object({ workerId: z.string() }))
    .query(async ({ input }) => {
      return await workerService.getWorkerById(input.workerId);
    }),

  createWorker: supervisorProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        employeeId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await workerService.createWorker(input);
    }),

  updateUserRole: supervisorProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["worker", "supervisor"]),
      })
    )
    .mutation(async ({ input }) => {
      return await workerService.updateUserRole(input.email, input.role);
    }),

  checkIn: protectedProcedure
    .input(
      z.object({
        workerId: z.string(),
        siteId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await workerService.checkIn(
        input.workerId,
        input.siteId,
        input.notes
      );
    }),

  checkOut: protectedProcedure
    .input(
      z.object({
        workerId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await workerService.checkOut(input.workerId, input.notes);
    }),

  getActiveCheckIns: protectedProcedure
    .input(
      z.object({
        siteId: z.string().optional(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      return await workerService.getActiveCheckIns(input);
    }),

  getCheckInHistory: protectedProcedure
    .input(
      z.object({
        workerId: z.string().optional(),
        siteId: z.string().optional(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      return await workerService.getCheckInHistory(input);
    }),
});
