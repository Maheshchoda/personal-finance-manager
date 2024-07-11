import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

export const category = pgTable("categories", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  plaidId: text("plaid_id"),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
});

export const transaction = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id").references(() => account.id, {
    onDelete: "cascade",
  }),
  categoryId: text("category_id").references(() => category.id, {
    onDelete: "set null",
  }),
});

export const accountRelations = relations(account, ({ many }) => ({
  transaction: many(transaction),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  transaction: many(transaction),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  account: one(account, {
    fields: [transaction.accountId],
    references: [account.id],
  }),
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id],
  }),
}));

export const AccountSchema = createInsertSchema(account);
export const CategorySchema = createInsertSchema(category);
export const TransactionSchema = createInsertSchema(transaction);
