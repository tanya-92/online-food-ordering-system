import express from 'express';
const router = express.Router();
import { addItem, getItemsByCanteen, deleteItem, updateItem, getAllItems } from '../controllers/itemController.js';
import { protect, owner } from '../middleware/authMiddleware.js';

router.route('/').get(getAllItems).post(protect, owner, addItem);
router.route('/:canteenId').get(getItemsByCanteen);
router.route('/:id').delete(protect, owner, deleteItem).put(protect, owner, updateItem);

export default router;
