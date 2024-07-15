import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { parse, subDays } from "date-fns";

import { db } from "@/drizzle";
import {
  account,
  category,
  transaction,
  TransactionSchema,
} from "@/drizzle/schema";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
  // Protected route to get all transactions for the authenticated user, by default it retrieves last 30 days transaction, which can be customized with query keys
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const { from, to, accountId } = c.req.valid("query");

        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);
        const startDate = from
          ? parse(from, "yyyy-MM-dd", new Date())
          : defaultFrom;
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

        const data = await db
          // Select specific columns and alias some of them
          .select({
            id: transaction.id,
            date: transaction.date,
            amount: transaction.amount,
            payee: transaction.payee,
            notes: transaction.notes,
            category: category.name,
            categoryId: category.id,
            account: account.name,
            accountId: account.id,
          })
          // From transaction table
          .from(transaction)
          // Inner join with account table
          .innerJoin(account, eq(transaction.accountId, account.id))
          // Left join with category table
          .leftJoin(category, eq(transaction.categoryId, category.id))
          // Apply filters
          .where(
            and(
              accountId ? eq(transaction.accountId, accountId) : undefined,
              eq(account.userId, auth.userId), // Filter by authenticated user's userId
              gte(transaction.date, startDate), // Filter by startDate
              lte(transaction.date, endDate), // Filter by endDate
            ),
          )
          // Order by transaction date in descending order
          .orderBy(desc(transaction.date));

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json({ data });
      } catch (error) {
        console.error("Error fetching transaction:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to get a specific transaction by ID
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      }),
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Un-Authorized" }, 401);
      }

      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing Id" }, 400);
      }

      try {
        const data = await db
          // Select specific columns and alias some of them
          .select({
            id: transaction.id,
            date: transaction.date,
            amount: transaction.amount,
            payee: transaction.payee,
            notes: transaction.notes,
            categoryId: category.id,
            accountId: account.id,
          })
          .from(transaction)
          .innerJoin(account, eq(transaction.accountId, account.id))
          .where(and(eq(account.userId, auth.userId), eq(transaction.id, id)));

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data: data[0] });
      } catch (error) {
        console.error(`Error fetching transaction with id:${id}`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to create a new transaction
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", TransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [data] = await db
          .insert(transaction)
          .values({
            ...values,
          })
          .returning();

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json({ data });
      } catch (error) {
        console.error("Error posting data:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  //Protected route to bulk create transactions
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator("json", z.array(TransactionSchema.omit({ id: true }))),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const data = await db
          .insert(transaction)
          .values({
            ...values,
          })
          .returning();

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json({ data });
      } catch (error) {
        console.error("Error posting data:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to bulk delete transactions
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);
      const { ids } = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        // Define a CTE to select transaction IDs to delete
        const transactionsToDelete = db.$with("transactions_to_delete").as(
          db
            .select({ id: transaction.id }) // Select the transaction ID
            .from(transaction)
            .innerJoin(account, eq(transaction.accountId, account.id)) // Join with the account table to get user information
            .where(
              and(
                inArray(transaction.id, ids), // Filter transactions by the provided IDs
                eq(account.userId, auth.userId), // Ensure the account belongs to the authenticated user
              ),
            ),
        );

        // Delete transactions that match the IDs from the CTE and return their IDs
        const data = await db
          .with(transactionsToDelete) // Include the CTE in the delete query
          .delete(transaction) // Specify the delete operation on the transaction table
          .where(
            inArray(
              transaction.id,
              sql`(select id from ${transactionsToDelete})`, // Use the CTE to filter transactions to delete
            ),
          )
          .returning({
            id: transaction.id, // Return the IDs of the deleted transactions
          });

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json(data);
      } catch (error) {
        console.error("Error while performing Bulk Delete:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to update a specific transaction by ID
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", TransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");
      if (!id) return c.json({ error: "Missing Id" }, 400);

      const values = c.req.valid("json");

      try {
        const transactionsToUpdate = db.$with("transactions_to_update").as(
          db
            .select({ id: transaction.id })
            .from(transaction)
            .innerJoin(account, eq(transaction.accountId, account.id))
            .where(
              and(eq(account.userId, auth.userId), eq(transaction.id, id)),
            ),
        );
        const [data] = await db
          .with(transactionsToUpdate)
          .update(transaction)
          .set(values)
          .where(
            inArray(
              transaction.id,
              sql`select id from ${transactionsToUpdate}`,
            ),
          )
          .returning();

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json({ data });
      } catch (error) {
        console.error(`Error while Updating transaction with id:${id}`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to delete a specific transaction by ID
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      try {
        const transactionsToDelete = db.$with("transactions_to_delete").as(
          db
            .select({ id: transaction.id })
            .from(transaction)
            .innerJoin(account, eq(transaction.accountId, account.id))
            .where(
              and(eq(account.userId, auth.userId), eq(transaction.id, id)),
            ),
        );
        const data = await db
          .with(transactionsToDelete)
          .delete(transaction)
          .where(
            inArray(
              transaction.id,
              sql`select id from ${transactionsToDelete}`,
            ),
          )
          .returning({
            id: transaction.id,
          });

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json(data);
      } catch (error) {
        console.error(`Error while deleting transaction with Id:${id}:`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  );

export default app;
