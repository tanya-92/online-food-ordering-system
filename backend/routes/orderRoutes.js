import express from 'express';
const router = express.Router();
import {   placeOrder, 
  getMyOrders, 
  getCanteenOrders, 
  updateOrderStatus, 
  updatePaymentStatus, 
  deleteAllOrders  } from '../controllers/orderController.js';
import { protect, owner } from '../middleware/authMiddleware.js';

router.route('/').post(protect, placeOrder);
router.route('/my').get(protect, getMyOrders);
router.route('/canteen/:canteenId').get(protect, owner, getCanteenOrders);
router.route('/:id/order-status').put(protect, owner, updateOrderStatus);
router.route('/:id/payment-status').put(protect, owner, updatePaymentStatus);
router.route('/canteen/:canteenId/all').delete(protect, owner, deleteAllOrders);

export default router;
