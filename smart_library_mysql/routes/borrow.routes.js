import express from "express";
import { borrowBook } from "../controllers/borrow.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, borrowBook);

export default router;
