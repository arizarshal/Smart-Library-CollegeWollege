import { getMostBorrowedBooksByTitleService } from "../services/borrow.analytics.service.js";
import { catchAsync } from "../utils/AppError.js";

export const getMostBorrowedBooksByTitle = catchAsync(async (req, res) => {
    const { limit, from, to } = req.query;

    const result = await getMostBorrowedBooksByTitleService({
        limit, from, to
    });

    return res.status(200).json({
        data: result,
        meta: {
            limit: Number(limit) || null,
            from: from || null,
            to: to || null,
        }
    });
})

export default getMostBorrowedBooksByTitle;