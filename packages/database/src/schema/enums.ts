import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["worker", "supervisor"]);
export const workerStatusEnum = pgEnum("worker_status", ["active", "inactive"]);
export const checkInStatusEnum = pgEnum("check_in_status", [
  "checked_in",
  "checked_out",
]);
