import {
  createTRPCRouter,
  publicProcedure,
  supervisorProcedure,
} from "../trpc";
import { siteService } from "../services/site";
import {
  createSiteSchema,
  updateSiteWithIdSchema,
  getSiteByIdSchema,
  getSiteBySiteCodeSchema,
} from "../services/site/validation";

export const siteRouter = createTRPCRouter({
  getSites: publicProcedure.query(async () => {
    return await siteService.getSites();
  }),

  getActiveSites: publicProcedure.query(async () => {
    return await siteService.getActiveSites();
  }),

  getSiteById: publicProcedure
    .input(getSiteByIdSchema)
    .query(async ({ input }) => {
      return await siteService.getSiteById(input.siteId);
    }),

  getSiteBySiteCode: publicProcedure
    .input(getSiteBySiteCodeSchema)
    .query(async ({ input }) => {
      return await siteService.getSiteBySiteCode(input.siteCode);
    }),

  createSite: supervisorProcedure
    .input(createSiteSchema)
    .mutation(async ({ input }) => {
      return await siteService.createSite(input);
    }),

  updateSite: supervisorProcedure
    .input(updateSiteWithIdSchema)
    .mutation(async ({ input }) => {
      return await siteService.updateSite(input.siteId, input.data);
    }),
});
