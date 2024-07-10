import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/drizzle";
import { category, CategorySchema } from "@/drizzle/schema";

const app = new Hono()
  // Protected route to get all categories for the authenticated user
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const data = await db
        .select({
          id: category.id,
          name: category.name,
        })
        .from(category)
        .where(eq(category.userId, auth.userId));

      return c.json({ data });
    } catch (error) {
      console.error("Error fetching category:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  // Protected route to get a specific category by ID
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
            id: category.id,
            name: category.name,
          })
          .from(category)
          .where(and(eq(category.userId, auth.userId), eq(category.id, id)));

        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        console.error(`Error fetching category with id:${id}`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to create a new category
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", CategorySchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const [data] = await db
          .insert(category)
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
  // Protected route to bulk delete category
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
          .delete(category)
          .where(
            and(eq(category.userId, auth.userId), inArray(category.id, ids)),
          )
          .returning({
            id: category.id,
          });

        return c.json(data);
      } catch (error) {
        console.error("Error while performing Bulk Delete:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to update a specific category by ID
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", CategorySchema.pick({ name: true })),
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
          .update(category)
          .set(values)
          .returning()
          .where(and(eq(category.userId, auth.userId), eq(category.id, id)));

        if (!data) return c.json({ error: "Not found" }, 404);

        return c.json({ data });
      } catch (error) {
        console.error(`Error while Updating category with id:${id}`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  // Protected route to delete a specific category by ID
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
          .delete(category)
          .where(and(eq(category.userId, auth.userId), eq(category.id, id)))
          .returning({
            id: category.id,
          });

        return c.json(data);
      } catch (error) {
        console.error(`Error while deleting category with Id:${id}:`, error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  );

export default app;
