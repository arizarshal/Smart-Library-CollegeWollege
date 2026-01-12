import mongoose from "mongoose";
import Borrow from "../models/borrow.js";
import Book from "../models/book.js";
import Payment from "../models/payment.js"; 
import User from "../models/user.js";


const MAX_BORROW_DAYS = 14;

export const createBorrowService = async ({ userId, bookId, days }) => {
  const daysInt = Number(days);

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

  const activeBorrow = await Borrow.findOne({
    userId,
    status: "ACTIVE",
  });

  if (activeBorrow) {
    throw new Error("User already has an active borrow");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  if (book.isBorrowed) {
    throw new Error("Book already borrowed");
  }

  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(borrowDate.getDate() + daysInt);

  const totalCost = book.singlePricePerDay * daysInt;

  const borrow = await Borrow.create({
    userId,
    bookId,
    borrowDate,
    dueDate,
    totalCost,
    status: "ACTIVE",
  });

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



export const getActiveBorrowService = async (userId) => {
  const borrow = await Borrow.findOne({
    userId,
    status: "ACTIVE",
  }).populate("bookId", "title author singlePricePerDay image");

  if (!borrow) {
    return null;
  }

  return {
    borrowId: borrow._id,
    book: borrow.bookId,
    borrowDate: borrow.borrowDate,
    dueDate: borrow.dueDate,
    totalCost: borrow.totalCost,
    status: borrow.status,
  };
};


export const getBorrowSummaryService = async ({ userId, borrowId }) => {
  if (!mongoose.Types.ObjectId.isValid(borrowId)) {
    throw new Error("Invalid borrow ID");
  }

  const borrow = await Borrow.findOne({
    _id: borrowId,
    userId,
  }).populate("bookId", "title author singlePricePerDay duePerDay image");

  if (!borrow) {
    const err = new Error("Borrow not found");
    err.statusCode = 404;
    throw err;
  }

  return {
    borrowId: borrow._id,
    book: borrow.bookId,
    borrowDate: borrow.borrowDate,
    dueDate: borrow.dueDate,
    returnDate: borrow.returnDate || null,
    totalCost: borrow.totalCost,
    totalOverdue: borrow.totalOverdue,
    status: borrow.status,
  };
};




export const submitBorrowService = async ({ userId, borrowId, returnDate }) => {
  if (!mongoose.Types.ObjectId.isValid(borrowId)) {
    throw new Error("Invalid borrow ID");
  }

  if (!returnDate) {
    throw new Error("Return date is required");
  }

  const actualReturnDate = new Date(returnDate);

  const borrow = await Borrow.findOne({
    _id: borrowId,
    userId,
    status: "ACTIVE",
  });

  if (!borrow) {
    const err = new Error("Active borrow not found");
    err.statusCode = 404;
    throw err;
  }

  const book = await Book.findById(borrow.bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  const dueDate = new Date(borrow.dueDate);
  const diffMs = actualReturnDate - dueDate;

  const overdueDays = Math.max(
    0,
    Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  );

  const totalOverdue = overdueDays * book.duePerDay;

  borrow.returnDate = actualReturnDate;
  borrow.totalOverdue = totalOverdue;
  borrow.status = "RETURNED";
  await borrow.save();

  const totalAmount = borrow.totalCost + totalOverdue;

  const payment = await Payment.create({
    userId,
    borrowId: borrow._id,
    amount: totalAmount,
    status: "PENDING",
  });

  book.isBorrowed = false;
  await book.save();

  // 9️⃣ Update user balance
  const user = await User.findById(userId);
  if (!user) {
  throw new Error("User not found");
}
  user.balance += totalAmount;
  await user.save();

  return {
    borrow,
    overdueDays,
    totalOverdue,
    totalAmount,
    paymentStatus: payment.status,
  };
};



export const getBorrowHistoryService = async (userId) => {
  const borrows = await Borrow.find({
    userId,
    status: "RETURNED",
  })
    .populate("bookId", "title author image")
    .sort({ createdAt: -1 });

  return {
    count: borrows.length,
    history: borrows.map((b) => ({
      borrowId: b._id,
      book: b.bookId
        ? {
            title: b.bookId.title,
            author: b.bookId.author,
            image: b.bookId.image,
          }
        : null,
      borrowDate: b.borrowDate,
      dueDate: b.dueDate,
      returnDate: b.returnDate || null,
      totalCost: b.totalCost,
      totalOverdue: b.totalOverdue,
      status: b.status,
    })),
  };
};