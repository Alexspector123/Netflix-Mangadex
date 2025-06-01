import express from 'express';
import { protectRoute } from '../../backend_movie/middleware/protectRoute.js';
import uploadChapter from '../middlewares/uploadChapter.js';
import multer from 'multer';
import { fetchChapterList, fetchChapterByID, fetchChaptersBatch, fetchChapterReader, addChapter, getLatestChapInfo, deleteChapter} from '../controllers/chapter.controller.js';

const router = express.Router();
const parseBody = multer().none();

// Route to fetch chapters
router.get('/latest/info', protectRoute, getLatestChapInfo);
router.get('/reader/:id', fetchChapterReader);
router.post('/upload', protectRoute, uploadChapter.fields([{ name: "pages", maxCount: 150 }]), addChapter);
router.post('/batch', fetchChaptersBatch);

router.get('/', fetchChapterList);

router.delete('/:id', deleteChapter);
router.get('/:id', fetchChapterByID); 

export default router;
