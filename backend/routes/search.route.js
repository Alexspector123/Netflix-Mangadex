import express from 'express';
import { searchMovie, searchPerson, searchTv, getSearchHistory, removeItemFromSearchHistory, getFavouritesHistory, removeItemFromFavouritesHistory } from '../controllers/search.controller.js';

const router = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);

router.get("/history", getSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);

router.get("/favourite", getFavouritesHistory);
router.delete("/favourite/:id", removeItemFromFavouritesHistory);

export default router;