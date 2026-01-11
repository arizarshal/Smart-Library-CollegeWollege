import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateBorrow, calculateBorrowCost, createBorrow, getActiveBorrow,
  getBorrowSummary,
  submitBorrow, getBorrowHistory} from "../controllers/borrowController.js";


const router = express.Router();


router.post("/validate", authMiddleware, validateBorrow);
router.post("/calculate", authMiddleware, calculateBorrowCost)
router.post("/", authMiddleware, createBorrow);

router.get("/active", authMiddleware, getActiveBorrow);
router.get("/history", authMiddleware, getBorrowHistory);
router.get("/:borrowId/summary", authMiddleware, getBorrowSummary);
router.post("/:borrowId/submit", authMiddleware, submitBorrow);



export default router;