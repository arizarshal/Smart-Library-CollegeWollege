import mongoose from "mongoose";
import Book from "../models/book.js";
import { getAllBooksService } from "../services/book.service.js";
import AppError, { catchAsync } from "../utils/AppError.js";

export const getAllBooks = catchAsync(async (req, res) => {
  const result = await getAllBooksService(req.query);
  return res.status(200).json(result);
});

export const getBookById = catchAsync(async (req, res) => {
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    // Throw -> captured by catchAsync -> handled by global handler
    throw new AppError("Invalid book ID format", 400 );
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  return res.status(200).json(book);
});