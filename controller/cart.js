import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const addToCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = req.body.productId;
      const quantity = req.body.quantity || 1;
  
      const user = await User.findById(userId);
  
      // Check if the product is already in the user's cart
      const existingCartItem = user.cart.find((item) => item.product.toString() === productId);
  
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }
  
      await user.save();
  
      res.status(200).json({
        message: 'Product added to cart successfully',
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal server error',
        success: false,
      });
    }
  };
  
  const getCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate('cart.product');
  
      res.status(200).json({
        message: 'User cart retrieved successfully',
        success: true,
        data: {
          cart: user.cart,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal server error',
        success: false,
      });
    }
  };
  export const removeItemFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cartItem = await CartItem.findOneAndDelete({ user: userId, product: productId });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Cart item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  
  module.exports = {
    addToCart,
    getCart
  }