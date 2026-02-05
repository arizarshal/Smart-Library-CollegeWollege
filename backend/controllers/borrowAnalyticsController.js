import { getMostBorrowedBooksByTitleService } from "../services/borrow.analytics.service.js";
import { catchAsync } from "../utils/AppError.js";
import { createControllerLogger } from "../utils/controllerLogger.js";

const log = createControllerLogger("borrowAnalyticsController");

export const getMostBorrowedBooksByTitle = catchAsync(async (req, res) => {
    const { limit, from, to } = req.query;

    log.info(req, "hetMostBorrowedBooksByTitle called", {limit, from, to})

    const result = await getMostBorrowedBooksByTitleService({
        limit, from, to
    });

    log.debug(req, "getMostBorrowBookByTitle success", {
        count: result.length,
        topBook: result[0]?.title || null
    })

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