import express from "express";
import getPaymentHistory  from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/history", authMiddleware, getPaymentHistory);

export default router;
