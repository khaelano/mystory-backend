export interface CreateChapterBody {
    title: string;
    content: string;
    storyId: string;
}

export interface UpdateChapterBody {
    title?: string;
    content?: string;
}
