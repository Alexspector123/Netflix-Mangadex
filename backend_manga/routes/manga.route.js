import express from 'express';
import { searchManga, fetchVolumeListByID, addManga } from '../controllers/manga.controller.js';

const router = express.Router();

router.get('/search', searchManga);
router.get('/volume/:id', fetchVolumeListByID);
router.post('/upload', uploadCover.single("image"), addManga);

export default router;
