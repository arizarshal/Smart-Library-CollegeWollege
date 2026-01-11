import express from 'express';
import { getAllBooks, getBookById } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:bookId', getBookById);

export default router;
