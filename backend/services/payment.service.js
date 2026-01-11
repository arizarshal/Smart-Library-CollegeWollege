import Payment from "../models/payment.js";

export const getPaymentHistoryService = async (userId) => {
  const payments = await Payment.find({ userId })
    .sort({ createdAt: -1 });

  return {
    count: payments.length,
    payments,
  };
};