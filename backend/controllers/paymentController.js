import { getPaymentHistoryService } from "../services/payment.service.js";
import { catchAsync } from "../utils/AppError.js";

export const getPaymentHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;

    const paymentHistory = await getPaymentHistoryService(userId);

  return res.status(200).json(paymentHistory);
});

export default getPaymentHistory;
