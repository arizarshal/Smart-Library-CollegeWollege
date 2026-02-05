import Borrow from "../models/borrow.js";
import Book from "../models/book.js";
import Payment from "../models/payment.js";
import AppError, { catchAsync } from "../utils/AppError.js";
import { validateBorrowRules, createBorrowService, getBorrowSummaryService, submitBorrowService, getActiveBorrowService, getBorrowHistoryService } from "../services/borrow.service.js";
import { createControllerLogger } from "../utils/controllerLogger.js";

const MAX_BORROW_DAYS = 14;
const log = createControllerLogger("borrowController")

export const validateBorrow = catchAsync(async (req, res) => {
  const { bookId, days } = req.body;
  const userId = req.user.id;

  log.info(req, "validateBorrow called", {bookId})

  await validateBorrowRules({ userId, bookId, days });

    return res.status(200).json({
      message: "Borrow validation successful",
      allowed: true,
    });
});

export const calculateBorrowCost = catchAsync(async (req, res) => {
    const { bookId, days } = req.body;
  
    log.info(req, "calculateBorrowCost called", { bookId, days})
    
    if (!bookId || !days) {
      throw new AppError("Book ID and days are required", 400);
    }
    
    const daysInt = Number(days);
    if (!Number.isInteger(daysInt) || daysInt > MAX_BORROW_DAYS) {
      throw new AppError(`Days must be an integer between 1 and ${MAX_BORROW_DAYS}`, 400);
    }

    const book = await Book.findById(bookId);


    // console.log("BOOK FOUND:", book);
    if (!book) throw new AppError("Book not found", 404);

    if (book.isBorrowed) {
      throw new AppError("Book is already borrowed", 400);
    }

    if (typeof book.singlePricePerDay !== "number") {
      throw new AppError("Book pricing misconfigured", 500)
    }

    const totalCost = daysInt * book.singlePricePerDay;

    return res.status(200).json({
      bookId: book._id,
      title: book.title,
      singlePricePerDay: book.singlePricePerDay,
      days,
      totalCost,
    });
  });


export const createBorrow = catchAsync(async (req, res) => {
    const { bookId, days } = req.body;
    log.info(req, "createBorrow called", { bookId, days });

    const userId = req.user.id;

    const result = await createBorrowService({
      userId,
      bookId,
      days,
    });

    log.info(req, "createBorrow success", { bookId, days });

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
});


export const getActiveBorrow = catchAsync(async (req, res) => {
    const userId = req.user.id;            //from auth middleware
    log.info(req, "getActiveBorrow called")

    const activeBorrow = await getActiveBorrowService(userId);

    log.debug(req, "getActiveBorrow success", { 
    hasBorrow: !!activeBorrow,
    borrowId: activeBorrow?._id 
  });

    if (!activeBorrow) {
      return res.status(200).json({
        message: "No active borrow",
        activeBorrow: null,
      });
    }

    return res.status(200).json(activeBorrow);
});


export const getBorrowSummary = catchAsync(async (req, res) => {
    const { borrowId } = req.params;
    const userId = req.user.id;             //from auth middleware
    log.info(req, "getBorrowSummary called")

    const summary = await getBorrowSummaryService({
      userId,
      borrowId,
    });

    log.debug(req, "getBorrowSummary success", { 
    total: summary.total,
    active: summary.active 
  });

    return res.status(200).json(summary);
});


export const submitBorrow = catchAsync(async (req, res) => {
    const { borrowId } = req.params;
    const { returnDate } = req.body;
    const userId = req.user.id;           //from auth middleware

    log.info(req, "submitBorrow called", { borrowId, returnDate });
  

    const result = await submitBorrowService({
      userId,
      borrowId,
      returnDate,
    });

    log.debug(req, "submitBorrow success", { 
    borrowId,
    payment: result.payment._id,
    overdueDays: result.overdueDays 
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
});



export const getBorrowHistory = catchAsync(async (req, res) => {
    const userId = req.user.id;
    log.info(req, "getBorrowHistory called");

    const historyData = await getBorrowHistoryService(userId);

    log.debug(req, "getBorrowHistory success", { count: historyData.length });
  
    return res.status(200).json(historyData);

});
