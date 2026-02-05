import express from 'express';
import { register, login, profile } from '../controllers/authController.js';
import  {authLimiter} from "../middleware/rateLimiter.js";
import authMiddleware from '../middleware/authMiddleware.js';
import { tagController } from '../middleware/globalLogFileIdentifier.js';

const router = express.Router();

router.use(tagController("authController"))


router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', authMiddleware, profile);

export default router;  