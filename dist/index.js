"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = require("hono/cors");
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const auth_1 = __importDefault(require("./routes/auth"));
const steps_1 = __importDefault(require("./routes/steps"));
const logger_1 = require("hono/logger");
const cloudinary_1 = __importDefault(require("cloudinary"));
const app = new hono_1.Hono();
app.use((0, logger_1.logger)());
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
cloudinary_1.default.v2.config();
app.use("/api/*", (0, cors_1.cors)());
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
console.log("🔥 server running on port:", port);
app.route("/api", auth_1.default);
app.route("/api", steps_1.default);
