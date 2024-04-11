"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFile = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const UploadFile = async (filePath, file_arr, c) => {
    const response = await (0, promises_1.writeFile)(filePath, file_arr);
    const uploadResponseCloudinary = await uploaddImage(filePath);
    //save to database
    return uploadResponseCloudinary;
};
exports.UploadFile = UploadFile;
const uploaddImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    try {
        // Upload the image
        const result = await cloudinary_1.default.v2.uploader.upload(imagePath, options);
        (0, fs_1.unlink)(imagePath, (err) => {
            console.log(err);
        });
        return result;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
