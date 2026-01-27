import express from "express";
import { getAvailableBooks } from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", getAvailableBooks);

export default router;
