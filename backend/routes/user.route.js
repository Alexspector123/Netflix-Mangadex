import express from 'express';
import { updateVipStatus } from '../controllers/user.controller.js';
const router = express.Router();

router.patch('/update-vip', updateVipStatus);

export default router;
