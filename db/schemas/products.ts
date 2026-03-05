import { pgTable } from "drizzle-orm/pg-core";
import { boolean, integer, text, varchar } from "drizzle-orm/pg-core";
import { user } from "@/db/schemas/auth-schema";
import { timestamps } from "@/db/common/timestamps";
import { InferSelectModel } from "drizzle-orm";

export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar().notNull(),
  description: text().notNull(),
  hidden: boolean().default(false),
  ...timestamps
});

export type Product = InferSelectModel<typeof products>;
