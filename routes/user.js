import express from "express";
import userControllers from "../controller/user.js"; 
import protect from "../middleware/authMiddleware.js";
import forgotPasswordController from '../controller/forgotPasswordController.js';
import resetPasswordController from '../controller/resetPasswordController.js';

const router = express.Router();

router.post("/register", userControllers.registerController);
router.post("/get-user", protect, userControllers.authController); 

router.post("/login", userControllers.loginController);
router.put("/update", protect, userControllers.updateUserProfile); 
 router.get("/types", userControllers.getDropdownOptions); 
 router.post("/add-to-wishlist", protect, userControllers.addToWishlist);
router.post("/remove-wishlist", userControllers.removeFromWishlist);
router.get("/get-wishlist", userControllers.getWishlist);
router.delete('/remove-wishlist/:userId/:productId', userControllers.removeSingleWishlistItem);
router.put("/switch-user/:userId", protect, userControllers.switchUserType); 


router.post('/forgotpassword', forgotPasswordController);


router.put('/passwordreset/:token', resetPasswordController);

router.get("/alluser",protect, userControllers.getAllUsers); 
router.get("/:id", userControllers.getUserById); 
router.post("/movetoCart",protect , userControllers.moveToCart); 




export default router;
