import express from 'express';
import { searchMovie, searchPerson, searchTv, getSearchHistory, removeItemFromSearchHistory, clearSearchHistory, getFavouritesHistory, removeItemFromFavouritesHistory, addToFavourites, clearFavouriteHistory } from '../controllers/search.controller.js';

const router = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);

router.get("/history", getSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);
router.delete("/history", clearSearchHistory);

router.get("/favourite", getFavouritesHistory);
router.post("/favourite", addToFavourites);
router.delete("/favourite/:id", removeItemFromFavouritesHistory);
router.delete("/favourite", clearFavouriteHistory);

export default router;