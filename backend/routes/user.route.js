// routes/user.routes.js
import express from "express";
import { updateVip } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/update-vip", updateVip); // Route này frontend đang gọi

export default router;
