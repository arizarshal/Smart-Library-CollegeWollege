import mongoose from "mongoose";
import Borrow from "../models/borrow.js";
import Book from "../models/book.js";

const MAX_BORROW_DAYS = 14;

export const createBorrowService = async ({ userId, bookId, days }) => {
  const daysInt = Number(days);

  // Basic validation
  if (!bookId || !days) {
    throw new Error("Book ID and days are required");
  }

  if (!Number.isInteger(daysInt)) {
    throw new Error("Days must be a number");
  }

  if (daysInt <= 0 || daysInt > MAX_BORROW_DAYS) {
    throw new Error(`Days must be between 1 and ${MAX_BORROW_DAYS}`);
  }

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new Error("Invalid book ID format");
  }

  // Check active borrow
  const activeBorrow = await Borrow.findOne({
    userId,
    status: "ACTIVE",
  });

  if (activeBorrow) {
    throw new Error("User already has an active borrow");
  }

  // Check book
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  if (book.isBorrowed) {
    throw new Error("Book already borrowed");
  }

  // Calculate dates & cost
  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(borrowDate.getDate() + daysInt);

  const totalCost = book.singlePricePerDay * daysInt;

  // Create borrow
  const borrow = await Borrow.create({
    userId,
    bookId,
    borrowDate,
    dueDate,
    totalCost,
    status: "ACTIVE",
  });

  // Mark book as borrowed
  book.isBorrowed = true;
  await book.save();

  return {
    borrow,
    book,
    borrowDate,
    dueDate,
    totalCost,
  };
};
