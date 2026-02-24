import express from 'express';
const router = express.Router();
import { placeOrder, getMyOrders, getCanteenOrders } from '../controllers/orderController.js';
import { protect, owner } from '../middleware/authMiddleware.js';

router.route('/').post(protect, placeOrder);
router.route('/my').get(protect, getMyOrders);
router.route('/canteen/:canteenId').get(protect, owner, getCanteenOrders);

export default router;
