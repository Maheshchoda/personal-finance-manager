import { Hono } from "hono";
import { handle } from "hono/vercel";

import accounts from "@/app/api/[[...route]]/accounts";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app.route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
