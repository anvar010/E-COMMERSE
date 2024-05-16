import express from "express";
import ExpressFormidable from "express-formidable";
import multer from "multer";
import imageUploadController from "../controller/ImageUpload.js";
 const router = express.Router()

router.post("/upload-image",
ExpressFormidable({maxFieldsSize: 5 * 2024 * 2024}),
imageUploadController
);
 export default router;