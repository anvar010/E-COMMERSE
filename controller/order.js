import Order from '../model/Order.js';

const createOrder = async (req, res) => {
    try {
        const { products } = req.body; 
        const userId = req.userId;

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
        console.log(error);
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
