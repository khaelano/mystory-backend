import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import path from "path";
import { config } from "../config.js";
import {
    r2Client,
    upload,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    getSignedUrl,
} from "../storage.js";

export { upload };

export const uploadCover = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const key = `covers/${randomUUID()}${ext}`;

    const command = new PutObjectCommand({
        Bucket: config.r2.bucketName,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    });

    await r2Client.send(command);

    const coverUrl = `${config.r2.publicUrl}/${key}`;

    res.status(201).json({ coverUrl, key });
};

export const getCover = async (req: Request<{ key: string }>, res: Response) => {
    const { key } = req.params;

    const command = new GetObjectCommand({
        Bucket: config.r2.bucketName,
        Key: `covers/${key}`,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    res.json({ url: signedUrl });
};

export const deleteCover = async (req: Request<{ key: string }>, res: Response) => {
    const { key } = req.params;

    const command = new DeleteObjectCommand({
        Bucket: config.r2.bucketName,
        Key: `covers/${key}`,
    });

    await r2Client.send(command);

    res.status(204).send();
};
