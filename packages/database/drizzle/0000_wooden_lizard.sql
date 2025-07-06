CREATE TYPE "public"."check_in_status" AS ENUM('checked_in', 'checked_out');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('worker', 'supervisor');--> statement-breakpoint
CREATE TYPE "public"."worker_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "check_in" (
	"id" text PRIMARY KEY NOT NULL,
	"worker_id" text NOT NULL,
	"site_id" text NOT NULL,
	"check_in_time" timestamp DEFAULT now() NOT NULL,
	"check_out_time" timestamp,
	"status" "check_in_status" DEFAULT 'checked_in' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "construction_site" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"site_code" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "construction_site_site_code_unique" UNIQUE("site_code")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'worker' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "worker" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"employee_id" text,
	"status" "worker_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "worker_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in" ADD CONSTRAINT "check_in_worker_id_worker_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."worker"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_in" ADD CONSTRAINT "check_in_site_id_construction_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."construction_site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "check_in_worker_idx" ON "check_in" USING btree ("worker_id");--> statement-breakpoint
CREATE INDEX "check_in_site_idx" ON "check_in" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "check_in_status_idx" ON "check_in" USING btree ("status");--> statement-breakpoint
CREATE INDEX "check_in_time_idx" ON "check_in" USING btree ("check_in_time");--> statement-breakpoint
CREATE INDEX "check_in_worker_site_idx" ON "check_in" USING btree ("worker_id","site_id");--> statement-breakpoint
CREATE INDEX "construction_site_active_idx" ON "construction_site" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "construction_site_code_idx" ON "construction_site" USING btree ("site_code");--> statement-breakpoint
CREATE INDEX "worker_status_idx" ON "worker" USING btree ("status");--> statement-breakpoint
CREATE INDEX "worker_employee_id_idx" ON "worker" USING btree ("employee_id");