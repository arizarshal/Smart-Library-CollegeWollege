import express from "express";
import getPaymentHistory  from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { tagController } from '../middleware/globalLogFileIdentifier.js';

const router = express.Router();
router.use(tagController("paymentController"))


router.get("/history", authMiddleware, getPaymentHistory);

export default router;
