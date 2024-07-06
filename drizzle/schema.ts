import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  plaidId: text("plaid_id"),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
});

export const insertAccountsSchema = createInsertSchema(accounts);
