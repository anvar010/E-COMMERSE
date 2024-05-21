// routes/cart.js

import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { addItemToCart, getUserCart, removeItemFromCart, clearCart,decreaseCartItemQuantity} from '../controller/cart.js';

const router = express.Router();

// Apply protect middleware before addItemToCart
router.post('/add-to-cart', addItemToCart);
router.get('/get-cart', protect, getUserCart);
router.delete('/remove-from-cart/:userId/:productId', protect, removeItemFromCart);
router.delete('/decrease-quantity/:userId/:productId', protect, decreaseCartItemQuantity); 
router.delete('/clear-cart', protect, clearCart);

export default router;
