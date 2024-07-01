import Admin from '../model/Admin.js'; // Adjust the path as per your project structure
import Product from '../model/Product.js'; 
import User from '../model/User.js'; 
import bcrypt from 'bcrypt';
import sendEmail from '../utils/sendEmail.js'
import jwt from 'jsonwebtoken';

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required",
                success: false
            });
        }

        const admin = await Admin.findOne({ email }).select("+password");
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        admin.password = undefined;

        return res.status(200).json({
            message: "Admin login successful",
            data: {
                admin,
                token
            },
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const disableProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { disableReason } = req.body; // Extract disableReason from req.body

        let product, user;

        try {
            product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            if (!product.userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Product owner userId not found'
                });
            }

            user = await User.findById(product.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const ownerEmail = user.email;
            if (!ownerEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'User email not found'
                });
            }

        
            await sendEmail(ownerEmail, 'Product Disabled', `Dear Owner,\n\nYour product ${product.name} has been disabled due to the following reason:\n\nReason: ${disableReason}\n\nRegards,\nYour App Team`);


            // Update product isActive status
            product.disabled = true;
            await product.save();

            return res.status(200).json({
                success: true,
                message: 'Product disabled and email sent to owner'
            });

        } catch (error) {
            console.error('Error in disableProduct:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }

    } catch (error) {
        console.error('Error in disableProduct:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const enableProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        let product, user;

        try {
            product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            if (!product.userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Product owner userId not found'
                });
            }

            user = await User.findById(product.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const ownerEmail = user.email;
            if (!ownerEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'User email not found'
                });
            }

            // Update product isActive status
            product.disabled = false;
            await product.save();

            // Optionally, you can notify the user via email
            await sendEmail(ownerEmail, 'Product Enabled', `Dear Owner,\n\nYour product ${product.name} has been enabled.\n\nRegards,\nYour App Team`);

            return res.status(200).json({
                success: true,
                message: 'Product enabled and email sent to owner'
            });

        } catch (error) {
            console.error('Error in enableProduct:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }

    } catch (error) {
        console.error('Error in enableProduct:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

  

export default {
    loginController,
    disableProduct,
    enableProduct
};
