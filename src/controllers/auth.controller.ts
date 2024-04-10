import { Context } from "hono";
import { AuthPayload } from "../types/auth";
import { ValidateAuth } from "../valaidations/auth";
import { db } from "../db";
import { steps, users } from "../db/schema";
import { eq, sql, or } from "drizzle-orm";
import { isEmpty } from "lodash";
import { hash } from "bcryptjs";
export const signup = async (c: Context) => {
  let body: AuthPayload;
  try {
    body = await c.req.json();
    await ValidateAuth(c, body);
  } catch (error) {
    return c.json({
      message: "validation failed",
      success: false,
    });
  }
  try {
    //check if email exist
    const user = await db.query.users.findFirst({
      where: or(eq(users.email, body.email), eq(users.username, body.username)),
    });
    if (!isEmpty(user)) {
      c.status(400);
      return c.json({
        message: "email already exist",
        success: false,
      });
    }
    //create user
    body.password = await hash(body.password, 10);
    const result = await db.insert(users).values(body).returning({
      id: users.id,
    });
    const user_id = result[0].id;
    await db.insert(steps).values({ user_id: user_id });
    return c.json({
      message: "user created successfully",
      success: true,
      data: {
        id: result[0].id,
      },
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      message: "something went wrong",
      success: false,
    });
  }
};

export const get_user_info = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  try {
    const user = await db.query.users.findFirst({
      columns: {
        password: false,
      },
      with: {
        steps: true,
      },
      where: eq(users.id, id),
    });
    return c.json({
      message: "user fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      message: "something went wrong",
      success: false,
    });
  }
};
