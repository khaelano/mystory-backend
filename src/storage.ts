import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import path from "path";
import { config } from "./config.js";

export const r2Client = new S3Client({
    region: "auto",
    endpoint: config.r2.endpoint,
    credentials: {
        accessKeyId: config.r2.accessKeyId,
        secretAccessKey: config.r2.secretAccessKey,
    },
});

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

        const ext = path.extname(file.originalname).toLowerCase();
        const isValidExt = allowedExtensions.includes(ext);
        const isValidMime = allowedMimeTypes.includes(file.mimetype);

        if (isValidExt && isValidMime) {
            cb(null, true);
        } else {
            cb(new Error("Only image files (jpg, png, webp, gif) are allowed"));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, getSignedUrl };
