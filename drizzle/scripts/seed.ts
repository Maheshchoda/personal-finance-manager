import { neon } from "@neondatabase/serverless";
import { createId } from "@paralleldrive/cuid2";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { subDays } from "date-fns";

import { account, category, transaction } from "@/drizzle/schema";

config({ path: ".env.local" });

const DAYS_IN_PERIOD = 90;

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

//test@maheshchoda.com
const seedUserId = "user_2jdXFteMvnykTLtR5g00jfdV34C";

const seedAccounts = [
  { id: createId(), name: "Savings Account", userId: seedUserId },
  { id: createId(), name: "Checking Account", userId: seedUserId },
  { id: createId(), name: "Credit Card", userId: seedUserId },
  { id: createId(), name: "Business Account", userId: seedUserId },
];

const seedCategories = [
  { id: createId(), name: "Groceries", userId: seedUserId },
  { id: createId(), name: "Utilities", userId: seedUserId },
  { id: createId(), name: "Entertainment", userId: seedUserId },
  { id: createId(), name: "Transport", userId: seedUserId },
  { id: createId(), name: "Healthcare", userId: seedUserId },
  { id: createId(), name: "Miscellaneous", userId: seedUserId },
];

const generateRandomDate = () => {
  const daysAgo = Math.floor(Math.random() * DAYS_IN_PERIOD);
  return subDays(new Date(), daysAgo);
};

const generateRandomAmount = () => {
  const amount = Math.floor(Math.random() * 10000) + 1;
  const isExpense = Math.random() < 0.5; // 50% chance to be an expense
  return (isExpense ? -amount : amount) * 1000;
};

const payees = [
  "Amazon",
  "Flipkart",
  "Uber",
  "Zomato",
  "Big Bazaar",
  "MedLife",
];
const notes = [
  "Shopping",
  "Ride",
  "Food",
  "Grocery",
  "Medical",
  "Bill Payment",
];

const seedTransactions = Array.from({ length: 100 }, () => ({
  id: createId(),
  amount: generateRandomAmount(),
  payee: payees[Math.floor(Math.random() * payees.length)],
  notes: notes[Math.floor(Math.random() * notes.length)],
  date: generateRandomDate(),
  accountId: seedAccounts[Math.floor(Math.random() * seedAccounts.length)].id,
  categoryId:
    seedCategories[Math.floor(Math.random() * seedCategories.length)].id,
}));

const main = async () => {
  try {
    // Delete Database
    await Promise.all([
      db.delete(account).execute(),
      db.delete(transaction).execute(),
      db.delete(category).execute(),
    ]);

    // Seed Database
    await Promise.all([
      db.insert(account).values(seedAccounts).execute(),
      db.insert(category).values(seedCategories).execute(),
      db.insert(transaction).values(seedTransactions).execute(),
    ]);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding the database:", error);
    process.exit(1);
  }
};

main();
