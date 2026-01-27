import { BorrowModel } from "../models/borrow.model.js";

export const borrowBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, days } = req.body;

    const result = await BorrowModel.borrowBook({
      userId,
      bookId,
      days,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
