import type { Request, Response } from "express";
import prisma from "../prisma.js";
import type { CreateChapterBody, UpdateChapterBody } from "../schemas/chapter.js";
import type { PaginationQuery } from "../schemas/pagination.js";

export const createChapter = async (req: Request<{}, {}, CreateChapterBody>, res: Response) => {
    const { title, content, storyId } = req.body;

    const chapter = await prisma.chapter.create({
        data: {
            title,
            content,
            storyId,
        },
        include: { story: true },
    });

    res.status(201).json(chapter);
};

export const getChapters = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response) => {
    const offset = parseInt(req.query.offset ?? "0", 10);
    const limit = parseInt(req.query.limit ?? "10", 10);

    const [chapters, total] = await Promise.all([
        prisma.chapter.findMany({
            skip: offset,
            take: limit,
            include: { story: true },
            orderBy: { createdAt: "desc" },
        }),
        prisma.chapter.count(),
    ]);

    res.json({
        data: chapters,
        pagination: {
            offset,
            limit,
            total,
        },
    });
};

export const getChapterById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const chapter = await prisma.chapter.findUnique({
        where: { id },
        include: { story: true },
    });

    if (!chapter) {
        res.status(404).json({ error: "Chapter not found" });
        return;
    }

    res.json(chapter);
};

export const getChaptersByStoryId = async (req: Request<{ storyId: string }, {}, {}, PaginationQuery>, res: Response) => {
    const { storyId } = req.params;
    const offset = parseInt(req.query.offset ?? "0", 10);
    const limit = parseInt(req.query.limit ?? "10", 10);

    const [chapters, total] = await Promise.all([
        prisma.chapter.findMany({
            where: { storyId },
            skip: offset,
            take: limit,
            include: { story: true },
            orderBy: { createdAt: "desc" },
        }),
        prisma.chapter.count({ where: { storyId } }),
    ]);

    res.json({
        data: chapters,
        pagination: {
            offset,
            limit,
            total,
        },
    });
};

export const updateChapter = async (req: Request<{ id: string }, {}, UpdateChapterBody>, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const chapter = await prisma.chapter.update({
        where: { id },
        data: {
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content }),
        },
        include: { story: true },
    });

    res.json(chapter);
};

export const deleteChapter = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    await prisma.chapter.delete({
        where: { id },
    });

    res.status(204).send();
};
