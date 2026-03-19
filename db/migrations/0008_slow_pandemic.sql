CREATE TYPE "public"."user_type" AS ENUM('customer', 'owner', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "type" "user_type" DEFAULT 'customer' NOT NULL;