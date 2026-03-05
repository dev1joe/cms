import { products } from "@/db/schema"
import {createInsertSchema, createSelectSchema, createUpdateSchema} from "drizzle-zod"
import xss from "xss";
import z from "zod";

export const productSelectSchema = createSelectSchema(products, {
    name: (schema) => schema.transform((item) => xss(item)),
    description: (schema) => schema.transform((item) => xss(item)),
});

export type productSelect = z.infer<typeof productSelectSchema>;

export const productInsertSchema = createInsertSchema(products, {
    name: (schema) => schema.transform((item) => xss(item)),
    description: (schema) => schema.transform((item) => xss(item)),
});

export type productInsert = z.infer<typeof productInsertSchema>;

export const productUpdateSchema = createUpdateSchema(products, {
    name: (schema) => schema.transform((item) => xss(item)),
    description: (schema) => schema.transform((item) => xss(item)),
});

export type productUpdate = z.infer<typeof productUpdateSchema>;