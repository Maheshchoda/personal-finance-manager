import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/drizzle";
import { account, AccountSchema } from "@/drizzle/schema";

const app = new Hono()
  // Protected route to get all account for the authenticated user
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const data = await db
        .select({
          id: account.id,
          name: account.name,
        })
        .from(account)
        .where(eq(account.userId, auth.userId));

      if (!data) return c.json({ error: "Not found" }, 404);

      return c.json({ data });
    } catch (error) {
      console.error("Error fetching account:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  // Protected route to get a specific account by ID
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
        const [data] = await db
          .select({
            id: account.id,
            name: account.name,
          })
          .from(account)
          .where(and(eq(account.userId, auth.userId), eq(account.id, id)));

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error(`Error fetching account with id:${id}`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to create a new account
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", AccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [data] = await db
          .insert(account)
          .values({
            userId: auth.userId,
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
  // Protected route to bulk delete account
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
        const data = await db
          .delete(account)
          .where(and(eq(account.userId, auth.userId), inArray(account.id, ids)))
          .returning({
            id: account.id,
          });

        return c.json(data);
      } catch (error) {
        console.error("Error while performing Bulk Delete:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to update a specific account by ID
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", AccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");
      if (!id) return c.json({ error: "Missing Id" }, 400);

      const values = c.req.valid("json");

      try {
        const [data] = await db
          .update(account)
          .set(values)
          .returning()
          .where(and(eq(account.userId, auth.userId), eq(account.id, id)));

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json({ data });
      } catch (error) {
        console.error(`Error while Updating account with id:${id}`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to delete a specific account by ID
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
        const data = await db
          .delete(account)
          .where(and(eq(account.userId, auth.userId), eq(account.id, id)))
          .returning({
            id: account.id,
          });

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json(data);
      } catch (error) {
        console.error(`Error while deleting account with Id:${id}:`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  );
export default app;
