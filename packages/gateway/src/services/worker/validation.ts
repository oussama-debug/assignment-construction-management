import { z } from "zod";

export const createWorkerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  employeeId: z.string().optional(),
});

export const checkInSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
  siteId: z.string().uuid("Invalid site ID"),
  notes: z.string().optional(),
});

export const checkOutSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
  notes: z.string().optional(),
});

export const getActiveCheckInsSchema = z.object({
  siteId: z.string().uuid("Invalid site ID").optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export const getCheckInHistorySchema = z.object({
  workerId: z.string().uuid("Invalid worker ID").optional(),
  siteId: z.string().uuid("Invalid site ID").optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(50),
});

export const getWorkerByIdSchema = z.object({
  workerId: z.string().uuid("Invalid worker ID"),
});
