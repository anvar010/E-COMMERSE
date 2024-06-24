import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../model/User.js'; // Adjust the path as necessary

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).send({
        message: 'Token is missing',
        success: false,
      });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({
        message: 'Invalid or expired token',
        success: false,
      });
    }

    const { password, passwordConfirm } = req.body;

    if (!password || !passwordConfirm) {
      return res.status(400).send({
        message: 'Please provide both password and password confirmation',
        success: false,
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).send({
        message: 'Passwords do not match',
        success: false,
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user's password fields with the hashed password
    user.password = hashedPassword;
    user.passwordConfirm = hashedPassword; // Update if necessary

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save the updated user object
    await user.save();

    res.status(200).send({
      message: 'Password reset successfully',
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Server error',
      success: false,
    });
  }
};

export default resetPasswordController;
