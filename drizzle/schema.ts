import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { createId } from "@paralleldrive/cuid2";

export const account = pgTable("accounts", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  plaidId: text("plaid_id"),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
});

export const AccountSchema = createInsertSchema(account);
