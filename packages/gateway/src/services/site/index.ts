import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import db from "@civalgo/database";
import { constructionSite } from "@civalgo/database/schema";

export const siteService = {
  async getSites() {
    const sites = await db.select().from(constructionSite);
    return sites;
  },

  async getActiveSites() {
    const sites = await db
      .select()
      .from(constructionSite)
      .where(eq(constructionSite.isActive, true));
    return sites;
  },

  async getSiteById(siteId: string) {
    const [site] = await db
      .select()
      .from(constructionSite)
      .where(eq(constructionSite.id, siteId));

    if (!site) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Site not found",
      });
    }

    return site;
  },

  async getSiteBySiteCode(siteCode: string) {
    const [site] = await db
      .select()
      .from(constructionSite)
      .where(eq(constructionSite.siteCode, siteCode));

    if (!site) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Site not found",
      });
    }

    return site;
  },

  async createSite(data: { name: string; address: string; siteCode: string }) {
    const [newSite] = await db
      .insert(constructionSite)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        address: data.address,
        siteCode: data.siteCode,
        isActive: true,
      })
      .returning();

    return newSite;
  },

  async updateSite(
    siteId: string,
    data: {
      name?: string;
      address?: string;
      siteCode?: string;
      isActive?: boolean;
    }
  ) {
    const [updatedSite] = await db
      .update(constructionSite)
      .set(data)
      .where(eq(constructionSite.id, siteId))
      .returning();

    if (!updatedSite) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Site not found",
      });
    }

    return updatedSite;
  },
};
