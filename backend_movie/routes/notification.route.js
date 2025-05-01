import express from 'express';
import { getNowPlayingNotifications, getTrendingNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/new', getNowPlayingNotifications);
router.get('/treding', getTrendingNotifications);

export default router;