// import { getDashboardSummaryService } from "../services/dashboard.service.js";
import { getDashboardSummaryAggregateService } from "../services/dashboard.aggregate.service.js";
import { catchAsync } from "../utils/AppError.js";

export const getDashboardSummary = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const summary = await getDashboardSummaryAggregateService(userId);

    return res.status(200).json(summary);
});
