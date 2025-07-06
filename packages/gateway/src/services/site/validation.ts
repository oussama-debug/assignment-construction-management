import { z } from "zod";

export const createSiteSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  address: z.string().min(1, "Address is required"),
  siteCode: z.string().min(1, "Site code is required"),
});

export const updateSiteSchema = z.object({
  name: z.string().min(1, "Site name is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  siteCode: z.string().min(1, "Site code is required").optional(),
  isActive: z.boolean().optional(),
});

export const getSiteByIdSchema = z.object({
  siteId: z.string().uuid("Invalid site ID"),
});

export const getSiteBySiteCodeSchema = z.object({
  siteCode: z.string().min(1, "Site code is required"),
});

export const updateSiteWithIdSchema = z.object({
  siteId: z.string().uuid("Invalid site ID"),
  data: updateSiteSchema,
});
