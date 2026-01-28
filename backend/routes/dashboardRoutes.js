import express from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

router.get("/summary", authMiddleware, authorizeRoles('USER', 'ADMIN', 'LIBRARIAN'), getDashboardSummary);

export default router;
