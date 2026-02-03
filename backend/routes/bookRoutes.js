import express from 'express';
import { getAllBooks, getBookById } from '../controllers/bookController.js';
// import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

router.get("/", getAllBooks);
router.get('/:bookId', getBookById);


// Protected route example:
// router.get('/:bookId', authorizeRoles('ADMIN', 'LIBRARIAN','USER'), getBookById);

export default router;
