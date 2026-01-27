import { BookModel } from "../models/book.model.js";

export const getAvailableBooks = async (req, res) => {
  try {
    const books = await BookModel.getAvailableBooks();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch books",
      error: err.message,
    });
  }
};
