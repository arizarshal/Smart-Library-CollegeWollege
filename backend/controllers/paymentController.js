import { getPaymentHistoryService } from "../services/payment.service.js";
import { catchAsync } from "../utils/AppError.js";
import { createControllerLogger } from "../utils/controllerLogger.js";

const log = createControllerLogger("paymentController")

export const getPaymentHistory = catchAsync(async (req, res) => {
  log.info(req, "getPaymentController called")
  const userId = req.user.id;

    const paymentHistory = await getPaymentHistoryService(userId);

    log.debug(req, "getPaymentHistory success", {count: paymentHistory?.count})

  return res.status(200).json(paymentHistory);
});

export default getPaymentHistory;
