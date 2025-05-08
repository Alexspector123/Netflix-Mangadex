import express from 'express';

import { getTrendingTVs, getTVTrailers, getTVDetails, getSimilarTVs, getTVsByCategory, getTVCredits } from '../controllers/tv.controller.js';

const router = express.Router();

router.get("/trending", getTrendingTVs);
router.get("/:id/trailers", getTVTrailers);
router.get("/:id/details", getTVDetails);
router.get("/:id/similar", getSimilarTVs);
router.get("/:category", getTVsByCategory);
router.get("/:id/credits", getTVCredits);

export default router;