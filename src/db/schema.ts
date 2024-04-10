import { relations } from "drizzle-orm";

import { serial, pgTable, text, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  username: text("username").notNull(),
  image_url: text("image_url"),
  location: text("location"),
  isDesigner: integer("is_designer").default(0),
  isInspiration: integer("is_inspiration").default(0),
  isHiring: integer("is_hirign").default(0),
  email_sent: boolean("email_sent").default(false),
});

export const usersRelations = relations(users, ({ one }) => ({
  steps: one(steps, {
    fields: [users.id],
    references: [steps.user_id],
  }),
}));

export const steps = pgTable("steps", {
  id: serial("id").primaryKey(),
  step_1: integer("step_1").notNull().default(0),
  step_2: integer("step_2").notNull().default(0),
  user_id: integer("user_id").notNull(),
});
