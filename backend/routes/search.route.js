import express from 'express';
import { searchMovie, searchPerson, searchTv, getSearchHistory, removeItemFromSearchHistory, clearSearchHistory, getFavouritesHistory, removeItemFromFavouritesHistory, addToFavourites, clearFavouriteHistory } from '../controllers/search.controller.js';
import { checkVip } from "../middleware/checkVip.js"; 

const router = express.Router();

router.get("/movie", searchMovie);
router.get("/tv", searchTv);
router.get("/person", searchPerson); 
router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);

router.get("/history", getSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);
router.delete("/history", clearSearchHistory);

router.get   ("/favourite", checkVip, getFavouritesHistory);
router.post  ("/favourite", checkVip, addToFavourites);
router.delete("/favourite/:id", checkVip, removeItemFromFavouritesHistory);
router.delete("/favourite", checkVip, clearFavouriteHistory);

export default router;