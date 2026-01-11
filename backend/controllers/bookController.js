import Book from "../models/book.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isBorrowed: false });
    console.log(books);
    res.status(200).json(books);
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("GET BOOK ERROR:", error);
    res.status(400).json({ message: "Invalid book ID" });
  }
};
