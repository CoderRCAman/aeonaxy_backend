import { serve } from "@hono/node-server";
import { Hono } from "hono";
const app = new Hono();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

serve({
  fetch: app.fetch,
  port,
});
console.log("🔥 server running on port:", port);
export default app;
