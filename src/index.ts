import "dotenv/config";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import auth from "./routes/auth";
import steps from "./routes/steps";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import cloudinary from "cloudinary";
const app = new Hono();
app.use(logger());
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
cloudinary.v2.config();
app.use(
  "/api/*",
  cors({
    origin: process.env.FRONTEND_API || "",
    allowHeaders: ["Origin", "Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);
serve({
  fetch: app.fetch,
  port,
});
console.log("🔥 server running on port:", port);
app.route("/api", auth);
app.route("/api", steps);
