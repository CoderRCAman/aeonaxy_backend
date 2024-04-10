import { Hono } from "hono";
import { get_user_info, signup } from "../controllers/auth.controller";

const auth = new Hono();
auth.post("/signup", signup);
auth.get("/user/:id", get_user_info);

export default auth;
