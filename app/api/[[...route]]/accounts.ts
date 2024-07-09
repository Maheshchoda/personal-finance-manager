import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { accounts, db } from "@/drizzle";
import { insertAccountsSchema } from "@/drizzle/schema";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId));

      return c.json({ data });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
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
            id: accounts.id,
            name: accounts.name,
          })
          .from(accounts)
          .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

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
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountsSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [data] = await db
          .insert(accounts)
          .values({
            userId: auth.userId,
            ...values,
          })
          .returning();

        return c.json({ data });
      } catch (error) {
        console.error("Error posting data:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
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
          .delete(accounts)
          .where(
            and(eq(accounts.userId, auth.userId), inArray(accounts.id, ids)),
          )
          .returning({
            id: accounts.id,
          });

        return c.json(data);
      } catch (error) {
        console.error("Error while performing Bulk Delete:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", insertAccountsSchema.pick({ name: true })),
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
          .update(accounts)
          .set(values)
          .returning()
          .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json({ data });
      } catch (error) {
        console.error(`Error while Updating account with id:${id}`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
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
          .delete(accounts)
          .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
          .returning({
            id: accounts.id,
          });

        return c.json(data);
      } catch (error) {
        console.error(`Error while deleting account with Id:${id}:`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  );
export default app;
