import express from 'express';
import forgotPasswordController from '../controllers/forgotPasswordController.js'; // Adjust the path as necessary
import resetPasswordController from '../controllers/resetPasswordController.js'; // Adjust the path as necessary

const router = express.Router();

router.post('/forgotpassword', forgotPasswordController);
router.put('/passwordreset/:resetToken', resetPasswordController);

export default router;
