import { getDB } from "@/db";
import { products } from "@/db/schema";
import { productInsert } from "@/schemes/products.schema";
import { eq, sql } from "drizzle-orm";

const db = getDB();

export async function getProducts() {
  return await db?.select().from(products);
}

export async function createProduct(data: productInsert) {
  return await db?.insert(products).values(data).returning();
}

export async function updateProduct(id: number, data: productInsert) {
  // there is no need to update the updatedAt timestamp, check timestamps.ts
  return await db?.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  return await db?.delete(products).where(eq(products.id, id));
}

export async function toggleVisiblity(id: number) {
  return await db?.update(products)
    .set({ hidden: sql`NOT ${products.hidden}` })
    .where(eq(products.id, id))
  // .returning()
}
