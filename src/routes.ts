import { Router } from "express";
import { createStory, deleteStory, getStories, getStoryById, updateStory } from "./controllers/story.js";
import { createChapter, deleteChapter, getChapterById, getChapters, getChaptersByStoryId, updateChapter } from "./controllers/chapter.js";
import { upload, uploadCover, getCover, deleteCover } from "./controllers/cover.js";

const router = Router();

router.route("/stories")
    .post(createStory)
    .get(getStories);

router.route("/stories/:id")
    .get(getStoryById)
    .put(updateStory)
    .delete(deleteStory);

router.route("/stories/:storyId/chapters")
    .get(getChaptersByStoryId)
    .post(createChapter);

router.route("/chapters")
    .get(getChapters);

router.route("/chapters/:id")
    .get(getChapterById)
    .put(updateChapter)
    .delete(deleteChapter);

router.route("/covers")
    .post(upload.single("cover"), uploadCover);

router.route("/covers/:key")
    .get(getCover)
    .delete(deleteCover);

export default router;