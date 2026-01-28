import Borrow from "../models/borrow.js";
import Book from "../models/book.js";
import Payment from "../models/payment.js";
import { createBorrowService, getBorrowSummaryService, submitBorrowService, getActiveBorrowService, getBorrowHistoryService } from "../services/borrow.service.js";

const MAX_BORROW_DAYS = 14;

export const validateBorrow = async (req, res) => {
  try {
     const { bookId, days } = req.body;
    const userId = req.user.id;

    await createBorrowService({ userId, bookId, days });

    return res.status(200).json({
      message: "Borrow validation successful",
      allowed: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const calculateBorrowCost = async (req, res) => {
  try {
    const { bookId, days } = req.body;

    const daysInt = Number(days);

//   if (!Number.isInteger(daysInt)) {
//   return res.status(400).json({ message: "Days must be a number" });
// }

    if (!bookId || !days) {
      return res.status(400).json({
        message: "Book ID and days are required",
      });
    }

    if (days <= 0 || days > MAX_BORROW_DAYS) {
      return res.status(400).json({
        message: `Days must be between 1 and ${MAX_BORROW_DAYS}`,
      });
    }

    const book = await Book.findById(bookId);
    // console.log("BOOK FOUND:", book);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.isBorrowed) {
      return res.status(400).json({
        message: "Book is already borrowed",
      });
    }

    if (typeof book.singlePricePerDay !== "number") {
  return res.status(500).json({
    message: "Book pricing misconfigured",
  });
}

    const totalCost = days * book.singlePricePerDay;

    return res.status(200).json({
      bookId: book._id,
      title: book.title,
      singlePricePerDay: book.singlePricePerDay,
      days,
      totalCost,
    });
  } catch (error) {
  return res.status(500).json({
    message: error.message,
  });
}
};



export const createBorrow = async (req, res) => {
   try {
    const { bookId, days } = req.body;
    const userId = req.user.id;

    const result = await createBorrowService({
      userId,
      bookId,
      days,
    });

    return res.status(201).json({
      message: "Book borrowed successfully",
      borrowId: result.borrow._id,
      book: {
        id: result.book._id,
        title: result.book.title,
      },
      borrowDate: result.borrowDate,
      dueDate: result.dueDate,
      totalCost: result.totalCost,
      status: result.borrow.status,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};


export const getActiveBorrow = async (req, res) => {
  try {
    const userId = req.user.id;            //from auth middleware

    const activeBorrow = await getActiveBorrowService(userId);

    if (!activeBorrow) {
      return res.status(200).json({
        message: "No active borrow",
        activeBorrow: null,
      });
    }

    return res.status(200).json(activeBorrow);
  } catch (error) {
    console.error("GET ACTIVE BORROW ERROR:", error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getBorrowSummary = async (req, res) => {
   try {
    const { borrowId } = req.params;
    const userId = req.user.id;             //from auth middleware

    const summary = await getBorrowSummaryService({
      userId,
      borrowId,
    });

    return res.status(200).json(summary);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
};




export const submitBorrow = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const { returnDate } = req.body;
    const userId = req.user.id;           //from auth middleware

    const result = await submitBorrowService({
      userId,
      borrowId,
      returnDate,
    });

    return res.status(200).json({
      message: "Book returned successfully",
      borrowId: result.borrow._id,
      returnDate: result.borrow.returnDate,
      overdueDays: result.overdueDays,
      totalOverdue: result.totalOverdue,
      totalCost: result.borrow.totalCost,
      totalAmount: result.totalAmount,
      paymentStatus: result.paymentStatus,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
};



export const getBorrowHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const historyData = await getBorrowHistoryService(userId);

    return res.status(200).json(historyData);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
