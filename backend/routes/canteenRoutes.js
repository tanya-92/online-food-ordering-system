import express from 'express';
const router = express.Router();
import { addCanteen, getCanteens, getMyCanteen } from '../controllers/canteenController.js';
import { protect, owner } from '../middleware/authMiddleware.js';

router.route('/').get(getCanteens).post(protect, owner, addCanteen);
router.route('/my').get(protect, owner, getMyCanteen);

export default router;
