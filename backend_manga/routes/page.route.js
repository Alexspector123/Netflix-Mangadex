import express from 'express';
import uploadChapter from '../middlewares/uploadChapter.js';
import {
  getPageList,
  createPages,
  updatePage,
  deletePage,
} from '../controllers/page.controller.js';
import { protectRoute } from '../../backend_movie/middleware/protectRoute.js';

const router = express.Router();

router.get('/:chapterId', getPageList);

router.post(
  '/:chapterId',
  protectRoute,
  uploadChapter.array('pages', 50),
  createPages
);

router.put('/:pageId', updatePage);

router.delete('/:pageId', deletePage);

export default router;