import express from "express";
import { 
  getTrendingPeoples, 
  getPopularPeoples, 
  getPeopleDetails,
  getPeopleCredits,
  getPeopleSocial,
  getFeaturedPerson,
  getPopularActors,
  getPopularDirectors,
  getAwardWinners
} from "../controllers/people.controller.js";

const router = express.Router();

router.get("/featured", getFeaturedPerson);
router.get("/trending", getTrendingPeoples);
router.get("/actors", getPopularActors);
router.get("/directors", getPopularDirectors);
router.get("/award_winners", getAwardWinners);

router.get("/:people_id/details", getPeopleDetails);
router.get("/:people_id/credits", getPeopleCredits);
router.get("/:people_id/social", getPeopleSocial);

export default router;
