import express from 'express';
import uploadManga from '../middlewares/uploadManga.js';
import { searchManga, fetchVolumeListByID, addManga } from '../controllers/manga.controller.js';

const router = express.Router();

router.get('/search', searchManga);
router.get('/volume/:id', fetchVolumeListByID);
router.post('/upload', uploadManga.single("image"), addManga);

export default router;
