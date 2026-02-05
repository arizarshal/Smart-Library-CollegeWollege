import mongoose from "mongoose";
import Book from "../models/book.js";
import { createControllerLogger } from "../utils/controllerLogger.js";
import { getAllBooksService } from "../services/book.service.js";
import AppError, { catchAsync } from "../utils/AppError.js";

const log = createControllerLogger("bookController")

export const getAllBooks = catchAsync(async (req, res) => {
  log.info(req, "getAllBooks called", {query: req.query})

  const result = await getAllBooksService(req.query);
  log.debug(req, "getAllBooks success", {count: Book.length})

  return res.status(200).json(result);
});

export const getBookById = catchAsync(async (req, res) => {
  const { bookId } = req.params;

  log.info(req, "getBookById called", {bookId})

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    // Throw -> captured by catchAsync -> handled by global handler
    throw new AppError("Invalid book ID format", 400 );
  }

  const book = await Book.findById(bookId);

  if (!book) {
    log.warn(req, "Book not found", {bookId})
    throw new AppError("Book not found", 404);
  }

  return res.status(200).json(book);
});