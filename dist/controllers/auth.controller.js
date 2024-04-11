"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_user_info = exports.signup = void 0;
const auth_1 = require("../valaidations/auth");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const lodash_1 = require("lodash");
const bcryptjs_1 = require("bcryptjs");
const signup = async (c) => {
    let body;
    try {
        body = await c.req.json();
        await (0, auth_1.ValidateAuth)(c, body);
    }
    catch (error) {
        return c.json({
            message: "validation failed",
            success: false,
        });
    }
    try {
        //check if email exist
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.email, body.email), (0, drizzle_orm_1.eq)(schema_1.users.username, body.username)),
        });
        if (!(0, lodash_1.isEmpty)(user)) {
            c.status(400);
            return c.json({
                message: "email or username already exist",
                success: false,
            });
        }
        //create user
        body.password = await (0, bcryptjs_1.hash)(body.password, 10);
        const result = await db_1.db.insert(schema_1.users).values(body).returning({
            id: schema_1.users.id,
        });
        const user_id = result[0].id;
        await db_1.db.insert(schema_1.steps).values({ user_id: user_id });
        return c.json({
            message: "user created successfully",
            success: true,
            data: {
                id: result[0].id,
            },
        });
    }
    catch (error) {
        console.log(error);
        c.status(500);
        return c.json({
            message: "something went wrong",
            success: false,
        });
    }
};
exports.signup = signup;
const get_user_info = async (c) => {
    const id = parseInt(c.req.param("id"));
    try {
        const user = await db_1.db.query.users.findFirst({
            columns: {
                password: false,
            },
            with: {
                steps: true,
            },
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, id),
        });
        return c.json({
            message: "user fetched successfully",
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        c.status(500);
        return c.json({
            message: "something went wrong",
            success: false,
        });
    }
};
exports.get_user_info = get_user_info;
