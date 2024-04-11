"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.steps = exports.usersRelations = exports.users = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    password: (0, pg_core_1.text)("password").notNull(),
    username: (0, pg_core_1.text)("username").notNull(),
    image_url: (0, pg_core_1.text)("image_url"),
    location: (0, pg_core_1.text)("location"),
    isDesigner: (0, pg_core_1.integer)("is_designer").default(0),
    isInspiration: (0, pg_core_1.integer)("is_inspiration").default(0),
    isHiring: (0, pg_core_1.integer)("is_hirign").default(0),
    email_sent: (0, pg_core_1.boolean)("email_sent").default(false),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one }) => ({
    steps: one(exports.steps, {
        fields: [exports.users.id],
        references: [exports.steps.user_id],
    }),
}));
exports.steps = (0, pg_core_1.pgTable)("steps", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    step_1: (0, pg_core_1.integer)("step_1").notNull().default(0),
    step_2: (0, pg_core_1.integer)("step_2").notNull().default(0),
    user_id: (0, pg_core_1.integer)("user_id").notNull(),
});
