import express from "express";
import adminControllers from "../controller/admin.js"; 
// import protect from "../middleware/authMiddleware.js"; 

const router = express.Router();


router.post("/adminlogin", adminControllers.loginController);
router.post("/disable/:productId", adminControllers.disableProduct);
router.post("/enable/:productId", adminControllers.enableProduct);

export default router;
