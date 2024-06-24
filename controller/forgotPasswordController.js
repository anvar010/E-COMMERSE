import nodemailer from 'nodemailer';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import path from 'path';
import crypto from 'crypto';
import User from '../model/User.js'; // Adjust the path as necessary
import dotenv from 'dotenv';

dotenv.config();

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 1025, // Use port 1025 if not specified
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Set up Handlebars as template engine
transporter.use('compile', nodemailerExpressHandlebars({
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./templates/'),
        layoutsDir: path.resolve('./templates/'),
        defaultLayout: 'resetPasswordEmail.hbs', // Default template file
    },
    viewPath: path.resolve('./templates/'),
    extName: '.hbs',
}));

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
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email
        const info = await transporter.sendMail({
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            template: 'resetPasswordEmail', // Template file name without extension
            context: {
                resetUrl: resetUrl
            }
        });

        console.log('Email sent: ', info.messageId);

        // Send response indicating email was sent successfully
        res.status(200).send({
            message: "Email sent successfully",
            success: true
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({
            message: "Server error",
            success: false
        });
    }
};

export default forgotPasswordController;
