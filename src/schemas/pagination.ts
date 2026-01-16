import type { Category, Status } from "../generated/prisma/client.js";

export interface PaginationQuery {
    offset?: string;
    limit?: string;
}

export interface StoryFilterQuery extends PaginationQuery {
    category?: Category;
    status?: Status;
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        offset: number;
        limit: number;
        total: number;
    };
}
