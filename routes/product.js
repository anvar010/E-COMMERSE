import express from "express";
import productControllers from "../controller/product.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addproduct", protect, productControllers.createProduct);
router.get("/getAllProduct", productControllers.getAllProduct);
router.get("/getNewProducts", productControllers.getNewProducts);
router.get("/specialProducts", productControllers.SpecialProducts);
router.get("/getTopRated", productControllers.getTopRating);
router.get("/getProduct/:id", productControllers.getProductById);
 router.put("/updateProduct/:id",protect,  productControllers.editProduct); 
router.get("/userProducts/:id", protect, productControllers.getProductsByUserId); 
router.post("/order", protect, productControllers.getProductsByUserId); 
router.get("/category/:category",productControllers.getProductsByCategory); 
router.post('/:id/reviews',productControllers.addProductReview); 
router.get('/:id/reviews',productControllers.getProductReviews); 
router.get('/:productName',productControllers.getProductByName); 
router.get('/sellerProducts/:id',productControllers.getProductsBySeller); 



export default router;
