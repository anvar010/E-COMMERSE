import Order from '../model/Order.js';
import Product from '../model/Product.js';
import mongoose from 'mongoose';

const createOrder = async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.userId; // Assuming userId is properly set in req by your auth middleware

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required', success: false });
        }

        // Validate products and update stock
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];

            // Validate productId as a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: `Invalid product ID: ${productId}`, success: false });
            }

            // Fetch the product from the database
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ error: `Product with ID ${productId} not found`, success: false });
            }

            // Check if enough stock is available
            if (product.stock < quantity) {
                return res.status(400).json({ error: `Not enough stock for product ${product.name}`, success: false });
            }

            // Decrease the stock quantity
            product.stock -= quantity;

            // Save the updated product back to the database
            await product.save();
        }

        // Create a new order
        const newOrder = new Order({
            userId: userId,
            products: products,
        });

        console.log("order : ", newOrder);
        const savedOrder = await newOrder.save();

        res.status(200).json({
            message: "Order successfully created",
            success: true,
            data: {
                order: savedOrder
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
};


const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req;
        const orders = await Order.find({ userId });

        if (orders.length === 0) {
            return res.status(404).json({
                message: "No orders found for this user",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                orders
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
};




  
  
  
  
  

export default { 
    createOrder,
    getOrdersByUserId
   
};
