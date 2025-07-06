import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import {
  workerStatusEnum,
  checkInStatusEnum,
  userRoleEnum,
} from "./enums";

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("worker").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const constructionSite = pgTable(
  "construction_site",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    address: text("address").notNull(),
    siteCode: text("site_code").notNull().unique(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    activeIdx: index("construction_site_active_idx").on(table.isActive),
    siteCodeIdx: index("construction_site_code_idx").on(table.siteCode),
  })
);

export const worker = pgTable(
  "worker",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    employeeId: text("employee_id").unique(),
    status: workerStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("worker_status_idx").on(table.status),
    employeeIdIdx: index("worker_employee_id_idx").on(table.employeeId),
  })
);

export const checkIn = pgTable(
  "check_in",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    workerId: text("worker_id")
      .notNull()
      .references(() => worker.id, { onDelete: "cascade" }),
    siteId: text("site_id")
      .notNull()
      .references(() => constructionSite.id, { onDelete: "cascade" }),
    checkInTime: timestamp("check_in_time").defaultNow().notNull(),
    checkOutTime: timestamp("check_out_time"),
    status: checkInStatusEnum("status").default("checked_in").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    workerIdx: index("check_in_worker_idx").on(table.workerId),
    siteIdx: index("check_in_site_idx").on(table.siteId),
    statusIdx: index("check_in_status_idx").on(table.status),
    checkInTimeIdx: index("check_in_time_idx").on(table.checkInTime),
    workerSiteIdx: index("check_in_worker_site_idx").on(
      table.workerId,
      table.siteId
    ),
  })
);

export * from "./enums";
