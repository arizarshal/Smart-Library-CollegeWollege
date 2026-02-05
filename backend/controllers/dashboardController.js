// import { getDashboardSummaryService } from "../services/dashboard.service.js";
import { getDashboardSummaryAggregateService } from "../services/dashboard.aggregate.service.js";
import { catchAsync } from "../utils/AppError.js";
import { createControllerLogger } from "../utils/controllerLogger.js";

const log = createControllerLogger("dashboardController")

export const getDashboardSummary = catchAsync(async (req, res) => {
    log.info(req, "getdashboardCSumary controller called")
    const userId = req.user.id;

    const summary = await getDashboardSummaryAggregateService(userId);

    log.debug(req, "getDashboardSummary success", { 
    activeBorrows: summary.activeBorrows,
    pendingPayments: summary.pendingPayments 
  });

    return res.status(200).json(summary);
});
