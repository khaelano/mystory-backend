import type { Category, Status } from "../generated/prisma/client.js";

export interface CreateChapterInput {
    title: string;
    content: string;
}

export interface CreateStoryBody {
    title: string;
    category: Category;
    keywords?: string[];
    synopsis: string;
    authorName: string;
    coverUrl?: string;
    chapters?: CreateChapterInput[];
}

export interface UpdateStoryBody {
    title?: string;
    category?: Category;
    keywords?: string[];
    synopsis?: string;
    status?: Status;
    coverUrl?: string;
}
