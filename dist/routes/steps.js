"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const steps_controller_1 = require("../controllers/steps.controller");
const body_limit_1 = require("hono/body-limit");
const steps = new hono_1.Hono();
steps.post("/step1", (0, body_limit_1.bodyLimit)({
    maxSize: 10 * 1024 * 1024,
    onError: (c) => {
        c.status(400);
        return c.json({
            success: false,
            message: "Cannot upload more than 10MB",
        });
    },
}), steps_controller_1.handleStepOne);
steps.post("/step2", steps_controller_1.handleStepTwo);
exports.default = steps;
