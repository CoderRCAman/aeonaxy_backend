import { Hono } from "hono";
import { handleStepOne, handleStepTwo } from "../controllers/steps.controller";
import { bodyLimit } from "hono/body-limit";

const steps = new Hono();
steps.post(
  "/step1",
  bodyLimit({
    maxSize: 10 * 1024 * 1024,
    onError: (c) => {
      c.status(400);
      return c.json({
        success: false,
        message: "Cannot upload more than 10MB",
      });
    },
  }),
  handleStepOne
);
steps.post("/step2", handleStepTwo);
export default steps;
