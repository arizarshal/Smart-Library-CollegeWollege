import mongoose from "mongoose";
import Book from "../models/book.js";


export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isBorrowed: false });
    res.status(200).json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};


export const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("GET BOOK ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
