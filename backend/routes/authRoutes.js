import express from 'express';
import { register, login, profile } from '../controllers/authController.js';
import  {authLimiter} from "../middleware/rateLimiter.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', authMiddleware, profile);

export default router;  