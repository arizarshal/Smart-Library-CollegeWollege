import Borrow from "../models/borrow.js";
import Payment from "../models/payment.js";
import User from "../models/user.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeBorrowsCount = await Borrow.countDocuments({
      userId,
      status: "ACTIVE",
    });

    const borrowHistoryCount = await Borrow.countDocuments({ userId });

    const pendingPayments = await Payment.find({
      userId,
      status: "PENDING",
    });

    const totalDue = pendingPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const user = await User.findById(userId);

    return res.status(200).json({
      activeBorrows: activeBorrowsCount,
      totalDue,
      balance: user.balance,
      historyCount: borrowHistoryCount,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
