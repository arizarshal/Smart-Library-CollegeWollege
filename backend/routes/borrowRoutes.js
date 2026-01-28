import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import { validateBorrow, 
  calculateBorrowCost, 
  createBorrow, 
  getActiveBorrow,
  getBorrowSummary,
  submitBorrow, 
  getBorrowHistory
} from "../controllers/borrowController.js";


const router = express.Router();

router.use(authMiddleware, authorizeRoles('USER', 'ADMIN'));

router.post("/validate", validateBorrow);
router.post("/calculate", calculateBorrowCost)
router.post("/", createBorrow);

router.get("/active", getActiveBorrow);
router.get("/history", getBorrowHistory);
router.get("/:borrowId/summary", getBorrowSummary);
router.post("/:borrowId/submit", submitBorrow);



export default router;