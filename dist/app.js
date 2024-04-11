"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const app = new hono_1.Hono();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
console.log("🔥 server running on port:", port);
exports.default = app;
