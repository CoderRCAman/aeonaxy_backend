import * as yup from "yup";
import { Context } from "hono";
import { AuthPayload } from "../types/auth";

export const ValidateAuth = async (c: Context, body: AuthPayload) => {
  let schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    username: yup.string().required(),
    password: yup.string().required(),
  });
  return schema.validate(body).catch(() => {
    c.status(400);
    throw new Error("Validation failed");
  });
};
export const ValidateStepTwp = async (c: Context, body: AuthPayload) => {
  let schema = yup.object().shape({
    id: yup.number().required(),
    is_designer: yup.boolean().required(),
    is_hiring: yup.boolean().required(),
    is_inspiration: yup.boolean().required(),
  });
  return schema.validate(body).catch(() => {
    c.status(400);
    throw new Error("Validation failed");
  });
};
