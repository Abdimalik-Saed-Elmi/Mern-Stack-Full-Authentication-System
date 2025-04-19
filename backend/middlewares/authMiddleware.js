// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/config.js";
import User from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ka soo saar token-ka header-ka
            token = req.headers.authorization.split(' ')[1];

            // Hubi token-ka
            const decoded = jwt.verify(token, JWT_SECRET);

            // Ka soo qaad user-ka id-ga decoded
            req.user = await User.findById(decoded.id).select('-password'); // Ha soo celinin password-ka

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};