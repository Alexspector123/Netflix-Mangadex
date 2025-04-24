import express from "express";
import { 
  getTrendingPeoples, 
  getPopularPeoples, 
  getPeopleDetails,
  getPeopleCredits,
  getPeopleSocial,
} from "../controllers/people.controller.js";
const router = express.Router();

router.get("/trending", getTrendingPeoples);
router.get("/popular", getPopularPeoples);
router.get("/:people_id/details", getPeopleDetails);
router.get("/:people_id/credits", getPeopleCredits);
router.get("/:people_id/social", getPeopleSocial);

export default router;
