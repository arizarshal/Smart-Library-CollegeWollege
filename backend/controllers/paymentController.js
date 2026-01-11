import { getPaymentHistoryService } from "../services/payment.service.js";

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const paymentHistory = await getPaymentHistoryService(userId);

    return res.status(200).json(paymentHistory);
  } catch (error) {
    console.error("PAYMENT HISTORY ERROR:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export default getPaymentHistory;
