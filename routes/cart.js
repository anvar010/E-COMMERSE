import express from 'express';
import protect from '../middleware/authMiddleware.js';
import cartControllers from '../controller/cart.js';

const router = express.Router();

router.post('/add-to-cart', protect, cartControllers.add);
router.get('/get-cart/:userId', protect, cartControllers.getCart);
router.delete('/cart/:userId/:productId', removeItemFromCart);


export default router;
