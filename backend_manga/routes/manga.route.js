import express from 'express';
import { searchManga, fetchVolumeListByID } from '../controllers/manga.controller.js';

const router = express.Router();

router.get('/search', searchManga);
router.get('/volume/:id', fetchVolumeListByID);

export default router;
