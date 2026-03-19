import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
  // TODO: add the resource "product"
} as const;

export const ac = createAccessControl(statement)

// user and admin roles already exist
// TODO: modify user and admin by adding there product permissions

export const owner = ac.newRole({});
