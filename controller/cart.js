import User from "../model/User.js";
import jwt from 'jsonwebtoken';

export const addItemToCart = async (req, res) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      console.log('Token:', token);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: 'Unauthorized - Token invalid' });
      }
  
      const userId = decoded.id;
      const productId = req.body.productId;
      const quantity = req.body.quantity || 1;
  
      if (!productId || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid productId or quantity' });
      }
  
      const user = await User.findById(userId);
      console.log('User:', user);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the product is already in the user's cart
      const existingCartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);
  
      if (existingCartItemIndex !== -1) {
        // Update the quantity of the existing item
        user.cart[existingCartItemIndex].quantity += quantity;
      } else {
        // Add the new item to the cart
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
  





  export const getUserCart = async (req, res) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: 'Unauthorized - Token invalid' });
      }
  
      const userId = decoded.id;
      const user = await User.findById(userId).populate('cart.product'); // Assuming you have a reference to the product in the cart array
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({
        message: 'User cart fetched successfully',
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
        console.log('User ID:', userId);
        console.log('Product ID:', productId);

        const user = await User.findByIdAndUpdate(userId, {
            $pull: { cart: { product: productId } },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        res.status(200).json({ message: 'Cart item removed', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

export const decreaseCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        console.log('User ID:', userId);
        console.log('Product ID:', productId);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in cart', success: false });
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity--; 
        } else {
            user.cart = user.cart.filter(item => item.product.toString() !== productId);
        }

        await user.save();

        res.status(200).json({ message: 'Cart item quantity decreased', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

export const increaseItemQuantity = async (req, res) => {
  try {
      const { userId, productId } = req.params;
      console.log('User ID:', userId);
      console.log('Product ID:', productId);
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found', success: false });
      }

      const cartItem = user.cart.find(item => item.product.toString() === productId);
      if (!cartItem) {
          return res.status(404).json({ error: 'Product not found in cart', success: false });
      }

      
      cartItem.quantity++;

      await user.save();

      res.status(200).json({ message: 'Cart item quantity increased', success: true });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error', success: false });
  }
};


export const clearCart = async (req, res) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: 'Unauthorized - Token invalid' });
      }
  
      const userId = decoded.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.cart = [];
  
      await user.save();
  
      res.status(200).json({
        message: 'Cart cleared successfully',
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Internal server error',
        success: false,
      });
    }
  };

  export const removeSingleProduct = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.cart = user.cart.filter(item => item.product.toString() !== productId);

        await user.save();

        res.status(200).json({ message: 'Product removed from cart and database successfully' });
    } catch (error) {
        console.error('Error removing single product from cart and database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




 
