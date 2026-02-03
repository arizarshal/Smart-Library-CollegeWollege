import mongoose from "mongoose";
import Borrow from "../models/borrow.js";
import Book from "../models/book.js";
import Payment from "../models/payment.js"; 
import User from "../models/user.js";
import AppError from "../utils/AppError.js";    


const MAX_BORROW_DAYS = 14;

export const validateBorrowRules = async ({ userId, bookId, days, session }) => {
  const daysInt = Number(days);

  if (!bookId || !days) {
    throw new AppError("Book ID and days are required", 400);
  }

  if (!Number.isInteger(daysInt) || daysInt <= 0 || daysInt > MAX_BORROW_DAYS) {
    throw new AppError(`Days must be between 1 and ${MAX_BORROW_DAYS}`, 400);
  }

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError("Invalid book ID format", 400);
  }

  const activeBorrow = await Borrow.findOne(
    { userId, status: "ACTIVE" },
    null,
    { session }
  );

  if (activeBorrow) {
    throw new AppError("User already has an active borrow", 400);
  }

  const book = await Book.findById(bookId).session(session);
  if (!book) {
    throw new AppError("Book not found", 404);
  }

  if (book.isBorrowed) {
    throw new AppError("Book already borrowed", 400);
  }

  return { book, daysInt };
};


export const createBorrowService = async ({ userId, bookId, days }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { book, daysInt } = await validateBorrowRules({
      userId,
      bookId,
      days,
      session,
    });

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + daysInt);

    const totalCost = book.singlePricePerDay * daysInt;

    const borrow = await Borrow.create(
      [{
        userId,
        bookId,
        borrowDate,
        dueDate,
        totalCost,
        status: "ACTIVE",
      }],
      { session }
    );

    book.isBorrowed = true;
    await book.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      borrow: borrow[0],
      book,
      borrowDate,
      dueDate,
      totalCost,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
    throw new AppError("Invalid borrow ID", 400);
  }

  const borrow = await Borrow.findOne({
    _id: borrowId,
    userId,
  }).populate("bookId", "title author singlePricePerDay duePerDay image");

  if (!borrow) {
    throw new AppError("Borrow not found", 404);
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


const validateReturnRules = async ({ userId, borrowId, session }) => {
  if (!mongoose.Types.ObjectId.isValid(borrowId)) {
    throw new AppError("Invalid borrow ID", 400);
  }

  const borrow = await Borrow.findOne(
    { _id: borrowId, userId, status: "ACTIVE" },
    null,
    { session }
  );

  if (!borrow) {
    throw new AppError("Active borrow not found", 404);
  }

  const book = await Book.findById(borrow.bookId).session(session);
  if (!book) {
    throw new AppError("Book not found", 404);
  }

  return { borrow, book };
};


const calculateFinalCost = ({ borrow, book, returnDate }) => {
  const borrowDate = new Date(borrow.borrowDate);
  const actualReturnDate = new Date(returnDate);

  if (actualReturnDate < borrowDate) {
    throw new AppError("Return date cannot be before borrow date", 400);
  }

  // Days used (minimum 1)
  const usedDays = Math.max(
    1,
    Math.ceil(
      (actualReturnDate - borrowDate) / (1000 * 60 * 60 * 24)
    )
  );

  const actualCost = usedDays * book.singlePricePerDay;

  const dueDate = new Date(borrow.dueDate);
  const overdueDays = Math.max(
    0,
    Math.ceil(
      (actualReturnDate - dueDate) / (1000 * 60 * 60 * 24)
    )
  );

  const totalOverdue = overdueDays * book.duePerDay;

  return {
    usedDays,
    actualCost,
    overdueDays,
    totalOverdue,
    totalAmount: actualCost + totalOverdue,
  };
};


export const submitBorrowService = async ({ userId, borrowId, returnDate }) => {
  if (!returnDate) {
    throw new AppError("Return date is required", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { borrow, book } = await validateReturnRules({
      userId,
      borrowId,
      session,
    });

    const {
      usedDays,
      actualCost,
      overdueDays,
      totalOverdue,
      totalAmount,
    } = calculateFinalCost({
      borrow,
      book,
      returnDate,
    });

    // Update borrow
    borrow.returnDate = new Date(returnDate);
    borrow.totalCost = actualCost;       
    borrow.totalOverdue = totalOverdue;
    borrow.status = "RETURNED";
    await borrow.save({ session });

    // Create payment
    const payment = await Payment.create(
      [{
        userId,
        borrowId: borrow._id,
        amount: totalAmount,
        status: "PENDING",
      }],
      { session }
    );

    // Update book availability
    book.isBorrowed = false;
    await book.save({ session });

    // Update user balance
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.balance += totalAmount;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      borrow,
      usedDays,
      overdueDays,
      totalOverdue,
      totalAmount,
      paymentStatus: payment[0].status,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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