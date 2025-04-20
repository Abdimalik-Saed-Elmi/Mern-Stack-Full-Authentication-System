// controllers/authController.js
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { unverifiedUsers } from "./userController.js";


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

        // Construct the reset link using the production domain
        const resetLink = `${req.headers.origin}/reset-password/${token}`;
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

        // Ka soo hel xogta isticmaalaha ku meel gaarka ah
        const unverifiedData = unverifiedUsers.get(email);

        if (!unverifiedData) {
            return res.status(404).json({ message: "User not found or registration expired." });
        }

        // Hubi koodka xaqiijinta
        if (
            unverifiedData.verificationCode !== verificationCode ||
            unverifiedData.verificationCodeExpiry < new Date()
        ) {
            unverifiedUsers.delete(email); // Ka saar haddii koodku khaldan yahay ama uu dhacay
            return res.status(400).json({ message: "Invalid or expired verification code." });
        }

        // Keydi isticmaalaha database-ka
        const user = new User({
            username: unverifiedData.username,
            email: unverifiedData.email,
            password: unverifiedData.password,
            isVerified: true,
        });
        await user.save();

        unverifiedUsers.delete(email); // Ka saar xogta ku meel gaarka ah

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

        const unverifiedData = unverifiedUsers.get(email);

        if (!unverifiedData) {
            return res.status(404).json({ message: "User not found or registration expired." });
        }

        const newVerificationCode = generateVerificationCode();
        const newVerificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        unverifiedUsers.set(email, { ...unverifiedData, verificationCode: newVerificationCode, verificationCodeExpiry: newVerificationCodeExpiry });

        // Send the new code via email
        const subject = "Your New Email Verification Code";
        const html = `<p>Your new email verification code is:</p><h3>${newVerificationCode}</h3><p>This code will expire in 15 minutes.</p>`;

        await sendEmail(email, subject, html);

        res.status(200).json({ message: "Verification code resent successfully. Please check your email." });

    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};