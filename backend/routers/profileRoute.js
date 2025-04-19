import express from 'express'
import { getProfile } from '../controllers/userController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const ProfileRouter = express.Router()

ProfileRouter.get('/profile', authenticate, getProfile);




export default ProfileRouter

