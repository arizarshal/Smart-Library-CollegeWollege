import express from 'express';
import { register, login, profile } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Register route
router.post('/register', register);
// Login route
router.post('/login', login);
// Profile route
router.get('/profile', authMiddleware, profile);

export default router;  