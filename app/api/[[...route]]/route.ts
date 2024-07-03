import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { log } from "console";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.get("/hello", clerkMiddleware(), (context) => {
  const auth = getAuth(context);
  if (!auth?.userId) return context.json({ error: " You are not authorized" });

  return context.json({
    message: "hello there",
  });
});

export const GET = handle(app);
export const POST = handle(app);
