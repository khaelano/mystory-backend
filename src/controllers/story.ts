import type { Request, Response } from "express";
import prisma from "../prisma.js";
import type { CreateStoryBody, UpdateStoryBody } from "../schemas/story.js";
import type { StoryFilterQuery } from "../schemas/pagination.js";

export const createStory = async (req: Request<{}, {}, CreateStoryBody>, res: Response) => {
    const { title, category, keywords, synopsis, authorName, coverUrl, chapters } = req.body;

    const story = await prisma.story.create({
        data: {
            title,
            category,
            keywords: keywords ?? [],
            synopsis,
            authorName,
            coverUrl: coverUrl ?? null,
            ...(chapters && { chapters: { create: chapters } }),
        },
        include: { chapters: true },
    });

    res.status(201).json(story);
};

export const getStories = async (req: Request<{}, {}, {}, StoryFilterQuery>, res: Response) => {
    const offset = parseInt(req.query.offset ?? "0", 10);
    const limit = parseInt(req.query.limit ?? "10", 10);
    const { category, status, search } = req.query;

    const where = {
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { authorName: { contains: search, mode: "insensitive" as const } },
            ],
        }),
        ...(category && { category }),
        ...(status && { status }),
    };

    const [stories, total] = await Promise.all([
        prisma.story.findMany({
            where,
            skip: offset,
            take: limit,
            include: { chapters: true },
            orderBy: { createdAt: "desc" },
        }),
        prisma.story.count({ where }),
    ]);

    res.json({
        data: stories,
        pagination: {
            offset,
            limit,
            total,
        },
    });
};

export const getStoryById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const story = await prisma.story.findUnique({
        where: { id },
        include: { chapters: true },
    });

    if (!story) {
        res.status(404).json({ error: "Story not found" });
        return;
    }

    res.json(story);
};

export const updateStory = async (req: Request<{ id: string }, {}, UpdateStoryBody>, res: Response) => {
    const { id } = req.params;
    const { title, category, keywords, synopsis, status, coverUrl } = req.body;

    const story = await prisma.story.update({
        where: { id },
        data: {
            ...(title !== undefined && { title }),
            ...(category !== undefined && { category }),
            ...(keywords !== undefined && { keywords }),
            ...(synopsis !== undefined && { synopsis }),
            ...(status !== undefined && { status }),
            ...(coverUrl !== undefined && { coverUrl }),
        },
        include: { chapters: true },
    });

    res.json(story);
};

export const deleteStory = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    await prisma.story.delete({
        where: { id },
    });

    res.status(204).send();
};