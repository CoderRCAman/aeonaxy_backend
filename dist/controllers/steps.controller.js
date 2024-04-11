"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStepTwo = exports.handleStepOne = void 0;
const path_1 = __importDefault(require("path"));
const cloudinary_helper_1 = require("../helper/cloudinary.helper");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../valaidations/auth");
const resend_1 = require("resend");
const ALLOWED_IMAGE_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const handleStepOne = async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body["file"];
        const location = body["location"];
        const id = parseInt(body["id"]);
        if (!id) {
            c.status(400);
            return c.json({
                message: "Invalid id",
                success: false,
            });
        }
        if (!file) {
            await db_1.db
                .update(schema_1.users)
                .set({
                location: location,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
            c.status(200);
            return c.json({
                message: "Updated",
                success: true,
            });
        }
        if (!ALLOWED_IMAGE_FILE_TYPES.includes(file?.type)) {
            c.status(400);
            return c.json({
                message: "Invalid file type",
                success: false,
            });
        }
        const file_name = `file_${new Date().getTime()}.${file?.name.split(".")[1]}`;
        const filePath = path_1.default.join(__dirname, "..", "uploads", file_name);
        const file_arr = Buffer.from(await file.arrayBuffer());
        const cloudinary_response = await (0, cloudinary_helper_1.UploadFile)(filePath, file_arr, c);
        console.log(id, location);
        console.log(cloudinary_response);
        await db_1.db
            .update(schema_1.users)
            .set({
            location: location,
            image_url: cloudinary_response.secure_url,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        c.status(201);
        return c.json({
            message: "Uploaded",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        c.status(500);
        return c.json({
            message: "Internal server error",
            success: false,
        });
    }
};
exports.handleStepOne = handleStepOne;
const handleStepTwo = async (c) => {
    try {
        const body = await c.req.json();
        //if any of these are missing
        try {
            await (0, auth_1.ValidateStepTwp)(c, body);
        }
        catch (error) {
            return c.json({
                message: "validation failed",
                success: false,
            });
        }
        let { id, is_designer, is_hiring, is_inspiration } = body;
        const updated_user = await db_1.db
            .update(schema_1.users)
            .set({
            isDesigner: is_designer,
            isHiring: is_hiring,
            isInspiration: is_inspiration,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .returning({ email: schema_1.users.email, email_sent: schema_1.users.email_sent });
        const email = updated_user[0].email;
        const email_sent = updated_user[0].email_sent;
        const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        if (!email_sent) {
            const res = await resend.emails.send({
                from: process.env.EMAIL_DOMAIN ?? "",
                to: email,
                subject: "Hello!",
                html: "<p><strong>Hi!</strong> I'm Amaresh Sarma 😎 this is just a greetings from my assessment!</p>",
            });
            await db_1.db
                .update(schema_1.users)
                .set({
                email_sent: true,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        }
        c.status(200);
        return c.json({
            message: "Updated",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        c.status(500);
        return c.json({
            message: "Internal server error",
            success: false,
        });
    }
};
exports.handleStepTwo = handleStepTwo;
