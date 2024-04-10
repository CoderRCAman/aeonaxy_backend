import cloudinary from "cloudinary";
import { unlink } from "fs";
import { writeFile } from "fs/promises";
import { Context } from "hono";

export const UploadFile = async (
  filePath: string,
  file_arr: Buffer,
  c: Context
) => {
  const response = await writeFile(filePath, file_arr);
  const uploadResponseCloudinary = await uploaddImage(filePath);
  //save to database
  return uploadResponseCloudinary;
};
const uploaddImage = async (imagePath: string) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    // Upload the image
    const result = await cloudinary.v2.uploader.upload(imagePath, options);
    unlink(imagePath, (err) => {
      console.log(err);
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
