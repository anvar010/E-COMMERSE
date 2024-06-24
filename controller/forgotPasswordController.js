import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../model/User.js'; // Adjust the path as necessary
import dotenv from 'dotenv';

dotenv.config();

const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                message: "User with this email does not exist",
                success: false
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

        // Update user's reset token and expiry
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        // Construct reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/passwordreset/${resetToken}`;

        // Email message content
        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        // Create Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 1025, // Use port 1025 if not specified
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            text: message
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send response indicating email was sent successfully
        res.status(200).send({
            message: "Email sent successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Server error",
            success: false
        });
    }
};

export default forgotPasswordController;
