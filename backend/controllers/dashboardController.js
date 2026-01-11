import { getDashboardSummaryService } from "../services/dashboard.service.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const summary = await getDashboardSummaryService(userId);

    return res.status(200).json(summary);
  } catch (error) {
    console.error("DASHBOARD ERROR:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};
