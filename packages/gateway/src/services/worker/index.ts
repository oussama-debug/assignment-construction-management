import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import db from "@civalgo/database";
import { worker, checkIn, constructionSite } from "@civalgo/database/schema";
import { workerSelectSchema } from "@civalgo/database/types";
import { z } from "zod";

export const workerService = {
  async getWorkers() {
    const workers = await db.select().from(worker);
    return workers;
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
    const [newWorker] = await db
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
  },

  async checkIn(workerId: string, siteId: string, notes?: string) {
    const existingCheckIn = await db
      .select()
      .from(checkIn)
      .where(
        and(eq(checkIn.workerId, workerId), eq(checkIn.status, "checked_in"))
      );

    if (existingCheckIn.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Worker is already checked in",
      });
    }

    const [newCheckIn] = await db
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
  },

  async checkOut(workerId: string, notes?: string) {
    const [activeCheckIn] = await db
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

    const [updatedCheckIn] = await db
      .update(checkIn)
      .set({
        status: "checked_out",
        checkOutTime: new Date(),
        notes: notes || activeCheckIn.notes,
      })
      .where(eq(checkIn.id, activeCheckIn.id))
      .returning();

    return updatedCheckIn;
  },

  async getActiveCheckIns(siteId?: string) {
    if (siteId) {
      return await db
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
        .where(
          and(eq(checkIn.status, "checked_in"), eq(checkIn.siteId, siteId))
        );
    }

    return await db
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
      .where(eq(checkIn.status, "checked_in"));
  },

  async getCheckInHistory(workerId?: string, siteId?: string, limit = 50) {
    if (workerId && siteId) {
      return await db
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
        .where(and(eq(checkIn.workerId, workerId), eq(checkIn.siteId, siteId)))
        .orderBy(desc(checkIn.checkInTime))
        .limit(limit);
    }

    if (workerId) {
      return await db
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
        .where(eq(checkIn.workerId, workerId))
        .orderBy(desc(checkIn.checkInTime))
        .limit(limit);
    }

    if (siteId) {
      return await db
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
        .where(eq(checkIn.siteId, siteId))
        .orderBy(desc(checkIn.checkInTime))
        .limit(limit);
    }

    return await db
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
      .orderBy(desc(checkIn.checkInTime))
      .limit(limit);
  },
};
