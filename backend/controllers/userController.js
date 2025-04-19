import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../configs/config.js";
import sendEmail from "../utils/sendEmail.js";

// Function si loo soo saaro kood lix-god ah
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();
        const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 daqiiqo
        const user = new User({
            username,
            email,
            password: hashedPassword,
            verificationCode,
            verificationCodeExpiry,
        });
        await user.save();

        // U dir emailka xaqiijinta
        const subject = "Xaqiiji Emailkaaga";
        const html = `<p>Waad ku mahadsan tahay isdiiwaangelintaada! Fadlan geli koodkaan si aad u xaqiijiso emailkaaga:</p><h3>${verificationCode}</h3><p>Koodkaan wuxuu dhici doonaa 15 daqiiqo gudahood.</p>`;

        await sendEmail(email, subject, html);

        res.status(200).json({ message: "User Registered Successfully. Please check your email to verify your account." });
    } catch (error) {
        res.status(500).json("Server Error: " + error.message);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Hubi in user-ka la xaqiijiyay
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email first." });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getProfile = async (req, res) => {
    try {
        // req.user wuxuu ku jiraa xogta user-ka ee middleware-ka authenticate
        res.status(200).json(req.user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};