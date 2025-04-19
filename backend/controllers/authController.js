// controllers/authController.js
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(200)
                .json({ message: "If the email exists, a reset link has been sent." });

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = Date.now() + 3600000; //1hr

        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${token}`;
        const html = `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
        `;

        await sendEmail(user.email, "Reset Your Password", html);
        res.json({ message: "Reset link sent to your email!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        console.log("Token:", token); // 👉 Token received from the URL

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        console.log("User:", user); // 👉 Here we check if the user was found

        if (!user)
            return res.status(400).json({ message: "Token expired or invalid" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: "Password reset successful!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        // Check if email and verification code are provided
        if (!email || !verificationCode) {
            return res
                .status(400)
                .json({ message: "Email and verification code are required." });
        }

        // Find the user based on the email
        const user = await User.findOne({ email });

        // Check if the user was found
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the verification code is correct and not expired
        if (
            user.verificationCode !== verificationCode ||
            user.verificationCodeExpiry < new Date()
        ) {
            return res
                .status(400)
                .json({ message: "Invalid or expired verification code." });
        }

        // Update the user, set isVerified to true, and remove the verification code
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        res
            .status(200)
            .json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};


const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({ email });

        if (!user || user.isVerified) {
            return res.status(400).json({ message: "Invalid email or account already verified." });
        }

        // Check the number of times the code has been sent (we can add a new field to the user model if needed)
        if (user.resendCount >= 3 && user.resendTime > Date.now() - 5 * 60 * 1000) { // 5 minutes
            return res.status(429).json({ message: "Too many requests. Please wait 5 minutes before trying again." });
        }

        // Generate a new code
        const verificationCode = generateVerificationCode();
        const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Update the user with the new code and expiry time
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = verificationCodeExpiry;
        user.resendCount = (user.resendCount || 0) + 1;
        user.resendTime = Date.now();
        await user.save();

        // Send the new code via email
        const subject = "Your New Email Verification Code";
        const html = `<p>Your new email verification code is:</p><h3>${verificationCode}</h3><p>This code will expire in 15 minutes.</p>`;

        await sendEmail(email, subject, html);

        res.status(200).json({ message: "Verification code resent successfully. Please check your email." });

    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};