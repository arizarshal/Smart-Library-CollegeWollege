import Payment from "../models/payment.js";

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("PAYMENT HISTORY ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

export default getPaymentHistory;
