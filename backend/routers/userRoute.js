import express from 'express'
import { getProfile, loginUser, Register } from '../controllers/userController.js'
import { forgotPassword, resendVerificationCode, resetPassword, verifyEmail } from '../controllers/authController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const Route = express.Router()

Route.post('/register', Register)
Route.post('/login', loginUser)

Route.post("/forgot-password", forgotPassword);
Route.post("/reset-password/:token", resetPassword);
Route.post('/verify-email', verifyEmail);
Route.post('/resend-verification-code', resendVerificationCode);
Route.get('/profile', authenticate, getProfile);




export default Route