import { getDB } from "@/db";
import { user } from "@/db/schemas/auth-schema";
import { eq } from "drizzle-orm";

const db = getDB()

export async function convertToOwner(id: string) {
  return await db?.update(user)
    .set({ type: "owner" })
    .where(eq(user.id, id));
}
