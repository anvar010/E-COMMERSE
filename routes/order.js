import express from "express";
import OrderConroller from '../controller/order.js';
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/order", protect, OrderConroller.createOrder); 
 router.get("/my-orders", protect, OrderConroller.getOrdersByUserId); 



export default router;
