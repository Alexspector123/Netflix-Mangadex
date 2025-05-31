import express from 'express';
import uploadManga from '../middlewares/uploadManga.js';
import { searchManga, fetchVolumeListByID, addManga, fetchChaptersByMangaIDFromDB, getMangaInfo } from '../controllers/manga.controller.js';

const router = express.Router();

router.get('/search', searchManga);
router.get('/volume/:id', fetchVolumeListByID);
router.get('/:id/chapter/db', fetchChaptersByMangaIDFromDB);
router.post('/upload', uploadManga.single("image"), addManga);
router.get('/:id', getMangaInfo);

export default router;
