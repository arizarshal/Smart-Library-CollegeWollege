import mongoose from "mongoose";
import Borrow from "../models/borrow.js";
import Book from "../models/book.js";
import Payment from "../models/payment.js";
import User from "../models/user.js";
import { createBorrowService } from "../services/borrow.service.js";

const MAX_BORROW_DAYS = 14;

export const validateBorrow = async (req, res) => {
  try {
    const { bookId, days } = req.body;
    const userId = req.user.id;

    // 1️⃣ Basic validation
    if (!bookId || !days) {
      return res.status(400).json({ message: "Book ID and days are required" });
    }

    if (!Number.isInteger(days) || days <= 0 || days > MAX_BORROW_DAYS) {
  return res.status(400).json({
    message: "Days must be an integer between 1 and 14",
  });
  }


    // 2️⃣ Check active borrow (only one allowed)
    const activeBorrow = await Borrow.findOne({
      userId,
      status: "ACTIVE",
    });

    if (activeBorrow) {
      return res
        .status(400)
        .json({ message: "User already has an active borrow" });
    }

    // 3️⃣ Check pending payment
    const pendingPayment = await Payment.findOne({
      userId,
      status: "PENDING",
    });

    if (pendingPayment) {
      return res
        .status(400)
        .json({ message: "Clear pending payment before borrowing" });
    }

    // 4️⃣ Check book availability
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.isBorrowed) {
      return res
        .status(400)
        .json({ message: "Book is already borrowed" });
    }

    // ✅ ALL CHECKS PASSED
    return res.status(200).json({
      message: "Borrow validation successful",
      allowed: true,
    });
  } catch (error) {
    console.error("BORROW VALIDATION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const calculateBorrowCost = async (req, res) => {
  try {
    const { bookId, days } = req.body;

    const daysInt = Number(days);

  if (!Number.isInteger(daysInt)) {
  return res.status(400).json({ message: "Days must be a number" });
}

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
    console.log("BOOK FOUND:", book);

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
    console.error("BORROW CALCULATE ERROR:", error);
  return res.status(500).json({
    message: error.message,   // 🔥 SHOW REAL ERROR
    name: error.name,
      stack: error.stack,
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
    console.error("CREATE BORROW ERROR:", error.message);

    return res.status(400).json({
      message: error.message,
    });
  }
};



/**
 * GET /borrows/active
 * Get current active borrow of logged-in user
 */
export const getActiveBorrow = async (req, res) => {
  try {
    const userId = req.user.id;

    const borrow = await Borrow.findOne({
      userId,
      status: "ACTIVE",
    }).populate("bookId", "title author singlePricePerDay");

    if (!borrow) {
      return res.status(200).json({
        message: "No active borrow",
        activeBorrow: null,
      });
    }

    return res.status(200).json({
      borrowId: borrow._id,
      book: borrow.bookId,
      borrowDate: borrow.borrowDate,
      dueDate: borrow.dueDate,
      totalCost: borrow.totalCost,
      status: borrow.status,
    });
  } catch (error) {
    console.error("GET ACTIVE BORROW ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /borrows/:borrowId/summary
 * Get summary of a specific borrow
 */
export const getBorrowSummary = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      return res.status(400).json({ message: "Invalid borrow ID" });
    }

    const borrow = await Borrow.findOne({
      _id: borrowId,
      userId,
    }).populate("bookId", "title author singlePricePerDay duePerDay");

    if (!borrow) {
      return res.status(404).json({ message: "Borrow not found" });
    }

    const allBorrows = await Borrow.find({ userId });
console.log("ALL BORROWS:", allBorrows.map(b => ({
  id: b._id,
  status: b.status
})));


    return res.status(200).json({
      borrowId: borrow._id,
      book: borrow.bookId,
      borrowDate: borrow.borrowDate,
      dueDate: borrow.dueDate,
      returnDate: borrow.returnDate || null,
      totalCost: borrow.totalCost,
      totalOverdue: borrow.totalOverdue,
      status: borrow.status,
    });
  } catch (error) {
    console.error("BORROW SUMMARY ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};




export const submitBorrow = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const { returnDate } = req.body;
    const userId = req.user.id;

    // 1️⃣ Validate borrowId
    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      return res.status(400).json({ message: "Invalid borrow ID" });
    }

    // 2️⃣ Validate return date
    if (!returnDate) {
      return res.status(400).json({ message: "Return date is required" });
    }

    const actualReturnDate = new Date(returnDate);

    // 3️⃣ Find borrow
    const borrow = await Borrow.findOne({
      _id: borrowId,
      userId,
      status: "ACTIVE",
    });

    if (!borrow) {
      return res.status(404).json({
        message: "Active borrow not found",
      });
    }

    // 4️⃣ Fetch related book
    const book = await Book.findById(borrow.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 5️⃣ Calculate overdue
    const dueDate = new Date(borrow.dueDate);

    const diffMs = actualReturnDate - dueDate;
    const overdueDays = Math.max(
      0,
      Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    );

    const totalOverdue = overdueDays * book.duePerDay;

    // 6️⃣ Update borrow
    borrow.returnDate = actualReturnDate;
    borrow.totalOverdue = totalOverdue;
    borrow.status = "RETURNED";
    await borrow.save();

    // 7️⃣ Create payment (PENDING)
    const totalAmount = borrow.totalCost + totalOverdue;

    const payment = await Payment.create({
      userId,
      borrowId: borrow._id,
      amount: totalAmount,
      status: "PENDING",
    });

    // 8️⃣ Update book availability
    book.isBorrowed = false;
    await book.save();

    // 9️⃣ Update user balance
    const user = await User.findById(userId);
    user.balance += totalAmount;
    await user.save();

    // 🔟 Response
    return res.status(200).json({
      message: "Book returned successfully",
      borrowId: borrow._id,
      returnDate: borrow.returnDate,
      overdueDays,
      totalOverdue,
      totalCost: borrow.totalCost,
      totalAmount,
      paymentStatus: payment.status,
    });
  } catch (error) {
    console.error("SUBMIT BORROW ERROR:", error);
    return res.status(500).json({
      message: error.message,
      name: error.name,
    });
  }
};



export const getBorrowHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const borrows = await Borrow.find({ userId, status: "RETURNED" })
      .populate("bookId", "title author")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: borrows.length,
      history: borrows.map((b) => ({
        borrowId: b._id,
        book: b.bookId ? {
              title: b.bookId.title,
              author: b.bookId.author,
            }
          : null,
        borrowDate: b.borrowDate,
        dueDate: b.dueDate,
        returnDate: b.returnDate || null,
        totalCost: b.totalCost,
        totalOverdue: b.totalOverdue,
        status: b.status,
      })),
    });
  } catch (error) {
    console.error("BORROW HISTORY ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
