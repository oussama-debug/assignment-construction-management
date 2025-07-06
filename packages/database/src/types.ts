import { createSelectSchema } from "drizzle-zod";
import {
  user,
  account,
  session,
  verification,
  constructionSite,
  worker,
  checkIn,
} from "./schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type User = InferSelectModel<typeof user>;
export type Account = InferSelectModel<typeof account>;
export type Session = InferSelectModel<typeof session>;
export type Verification = InferSelectModel<typeof verification>;
export type ConstructionSite = InferSelectModel<typeof constructionSite>;
export type Worker = InferSelectModel<typeof worker>;
export type CheckIn = InferSelectModel<typeof checkIn>;

export type NewUser = InferInsertModel<typeof user>;
export type NewAccount = InferInsertModel<typeof account>;
export type NewSession = InferInsertModel<typeof session>;
export type NewVerification = InferInsertModel<typeof verification>;
export type NewConstructionSite = InferInsertModel<typeof constructionSite>;
export type NewWorker = InferInsertModel<typeof worker>;
export type NewCheckIn = InferInsertModel<typeof checkIn>;

export const userSelectSchema = createSelectSchema(user);
export const accountSelectSchema = createSelectSchema(account);
export const sessionSelectSchema = createSelectSchema(session);
export const verificationSelectSchema = createSelectSchema(verification);
export const constructionSiteSelectSchema =
  createSelectSchema(constructionSite);
export const workerSelectSchema = createSelectSchema(worker);
export const checkInSelectSchema = createSelectSchema(checkIn);
