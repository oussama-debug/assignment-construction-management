import { TRPCError } from "@trpc/server";
import { eq, desc, and, count, SQL } from "drizzle-orm";
import db from "@civalgo/database";
import { worker, checkIn, constructionSite } from "@civalgo/database/schema";
import { auth } from "@civalgo/authentication";

export const workerService = {
  async getWorkers() {
    return await db.select().from(worker);
  },

  async getWorkerById(workerId: string) {
    const [workerData] = await db
      .select()
      .from(worker)
      .where(eq(worker.id, workerId));

    if (!workerData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Worker not found",
      });
    }

    return workerData;
  },

  async createWorker(data: {
    name: string;
    email?: string;
    phone?: string;
    employeeId?: string;
  }) {
    return await db.transaction(async (tx) => {
      const [newWorker] = await tx
        .insert(worker)
        .values({
          id: crypto.randomUUID(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          employeeId: data.employeeId,
          status: "active",
        })
        .returning();

      return newWorker;
    });
  },

  async checkIn(workerId: string, siteId: string, notes?: string) {
    return await db.transaction(async (tx) => {
      const existingCheckIn = await tx
        .select()
        .from(checkIn)
        .where(
          and(eq(checkIn.workerId, workerId), eq(checkIn.status, "checked_in"))
        );

      if (existingCheckIn.length > 0)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Worker is already checked in",
        });

      const [newCheckIn] = await tx
        .insert(checkIn)
        .values({
          id: crypto.randomUUID(),
          workerId,
          siteId,
          notes,
          status: "checked_in",
        })
        .returning();

      return newCheckIn;
    });
  },

  async checkOut(workerId: string, notes?: string) {
    return await db.transaction(async (tx) => {
      const [activeCheckIn] = await tx
        .select()
        .from(checkIn)
        .where(
          and(eq(checkIn.workerId, workerId), eq(checkIn.status, "checked_in"))
        )
        .orderBy(desc(checkIn.checkInTime));

      if (!activeCheckIn) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active check-in found for this worker",
        });
      }

      const [updatedCheckIn] = await tx
        .update(checkIn)
        .set({
          status: "checked_out",
          checkOutTime: new Date(),
          notes: notes || activeCheckIn.notes,
        })
        .where(eq(checkIn.id, activeCheckIn.id))
        .returning();

      return updatedCheckIn;
    });
  },

  async getActiveCheckIns(
    options: { siteId?: string; page?: number; limit?: number } = {}
  ) {
    const { siteId, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const whereCondition = siteId
      ? and(eq(checkIn.status, "checked_in"), eq(checkIn.siteId, siteId))
      : eq(checkIn.status, "checked_in");

    const baseQuery = db
      .select({
        id: checkIn.id,
        workerId: checkIn.workerId,
        workerName: worker.name,
        siteId: checkIn.siteId,
        siteName: constructionSite.name,
        checkInTime: checkIn.checkInTime,
        notes: checkIn.notes,
      })
      .from(checkIn)
      .leftJoin(worker, eq(checkIn.workerId, worker.id))
      .leftJoin(constructionSite, eq(checkIn.siteId, constructionSite.id))
      .where(whereCondition)
      .orderBy(desc(checkIn.checkInTime));

    const [data, totalResult] = await Promise.all([
      baseQuery.limit(limit).offset(offset),
      db.select({ count: count() }).from(checkIn).where(whereCondition),
    ]);

    const totalCount = totalResult[0]?.count || 0;

    return {
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },

  async getCheckInHistory(
    options: {
      workerId?: string;
      siteId?: string;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const { workerId, siteId, page = 1, limit = 50 } = options;
    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [];
    if (workerId) whereConditions.push(eq(checkIn.workerId, workerId));
    if (siteId) whereConditions.push(eq(checkIn.siteId, siteId));

    const whereCondition =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const baseQuery = db
      .select({
        id: checkIn.id,
        workerId: checkIn.workerId,
        workerName: worker.name,
        siteId: checkIn.siteId,
        siteName: constructionSite.name,
        checkInTime: checkIn.checkInTime,
        checkOutTime: checkIn.checkOutTime,
        status: checkIn.status,
        notes: checkIn.notes,
      })
      .from(checkIn)
      .leftJoin(worker, eq(checkIn.workerId, worker.id))
      .leftJoin(constructionSite, eq(checkIn.siteId, constructionSite.id))
      .orderBy(desc(checkIn.checkInTime));

    const finalQuery = whereCondition
      ? baseQuery.where(whereCondition)
      : baseQuery;

    const [data, totalResult] = await Promise.all([
      finalQuery.limit(limit).offset(offset),
      db.select({ count: count() }).from(checkIn).where(whereCondition),
    ]);

    const totalCount = totalResult[0]?.count || 0;

    return {
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },
};
