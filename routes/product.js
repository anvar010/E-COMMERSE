import express from "express";
import productControllers from "../controller/product.js"
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addproduct",protect, productControllers.createProduct);
router.get("/getAllProduct",productControllers.getAllProduct);
router.get("/getNewProducts",productControllers.getNewProducts);
router.get("/specialProducts",productControllers.getProductsFromDistinctCategory);
router.get("/getTopRated",productControllers.getTopRating);
router.get("/getProduct/:id",productControllers.getProductById);

export default router;
