"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const auth_controller_1 = require("../controllers/auth.controller");
const auth = new hono_1.Hono();
auth.post("/signup", auth_controller_1.signup);
auth.get("/user/:id", auth_controller_1.get_user_info);
exports.default = auth;
