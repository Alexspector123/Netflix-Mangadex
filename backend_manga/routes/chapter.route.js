import express from 'express';
import { protectRoute } from '../../backend_movie/middleware/protectRoute.js';
import uploadChapter from '../middlewares/uploadChapter.js';
import { fetchChapterList, fetchChapterByID, fetchChaptersBatch, fetchChapterReader, addChapter} from '../controllers/chapter.controller.js';

const router = express.Router();

// Route to fetch chapters
router.get('/', fetchChapterList);
router.get('/:id', fetchChapterByID);
router.post('/batch', fetchChaptersBatch);
router.get('/reader/:id', fetchChapterReader);
router.post('/upload', protectRoute, uploadChapter.fields([{ name: "pages", maxCount: 150 }]), addChapter);

export default router;
