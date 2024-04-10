import { createWriteStream, writeFile } from "fs";
import { Context } from "hono";
import path from "path";
import { UploadFile } from "../helper/cloudinary.helper";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { ValidateStepTwp } from "../valaidations/auth";
import { Resend } from "resend";
const ALLOWED_IMAGE_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
export const handleStepOne = async (c: Context) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"] as File;
    const location = body["location"] as string;
    const id = parseInt(body["id"] as string);
    if (!id) {
      c.status(400);
      return c.json({
        message: "Invalid id",
        success: false,
      });
    }
    if (!file) {
      await db
        .update(users)
        .set({
          location: location,
        })
        .where(eq(users.id, id));
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
    const file_name = `file_${new Date().getTime()}.${
      file?.name.split(".")[1]
    }`;
    const filePath = path.join(__dirname, "..", "uploads", file_name);
    const file_arr = Buffer.from(await file.arrayBuffer());
    const cloudinary_response: any = await UploadFile(filePath, file_arr, c);
    console.log(id, location);
    console.log(cloudinary_response);
    await db
      .update(users)
      .set({
        location: location,
        image_url: cloudinary_response.secure_url,
      })
      .where(eq(users.id, id));
    c.status(201);
    return c.json({
      message: "Uploaded",
      success: true,
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const handleStepTwo = async (c: Context) => {
  try {
    const body = await c.req.json();

    //if any of these are missing
    try {
      await ValidateStepTwp(c, body);
    } catch (error) {
      return c.json({
        message: "validation failed",
        success: false,
      });
    }
    let { id, is_designer, is_hiring, is_inspiration } = body;

    const updated_user = await db
      .update(users)
      .set({
        isDesigner: is_designer,
        isHiring: is_hiring,
        isInspiration: is_inspiration,
      })
      .where(eq(users.id, id))
      .returning({ email: users.email, email_sent: users.email_sent });
    const email = updated_user[0].email;
    const email_sent = updated_user[0].email_sent;
    const resend = new Resend(process.env.RESEND_API_KEY);
    if (!email_sent) {
      const res = await resend.emails.send({
        from: process.env.EMAIL_DOMAIN ?? "",
        to: email,
        subject: "Hello!",
        html: "<p><strong>Hi!</strong> I'm Amaresh Sarma 😎 this is just a greetings from my assessment!</p>",
      });
 
      await db
        .update(users)
        .set({
          email_sent: true,
        })
        .where(eq(users.id, id));
    }
    c.status(200);
    return c.json({
      message: "Updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      message: "Internal server error",
      success: false,
    });
  }
};
