import { AccountType, TransactionType, CategoryType } from "@/drizzle/schema";

export type ItemType = "accounts" | "categories" | "transactions";

export type ItemResponseMap = {
  accounts: AccountType[];
  transactions: TransactionType[];
  categories: CategoryType[];
};
