import books from "../data/books.js";
import { pool } from "../db/mysql.js";

const seedBooks = async () => {
  if (!Array.isArray(books)) {
    throw new Error("Books data is not an array");
  }

  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM books"
  );

  if (rows[0].count > 0) {
    console.log("📚 Books already exist. Skipping seed.");
    return;
  }

  for (const book of books) {
    await pool.query(
      `
      INSERT INTO books 
      (title, author, price_per_day, group_price_per_day, image, due_per_day)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        book.title,
        book.author,
        book.singlePricePerDay,
        book.groupPricePerDay,
        book.image,
        book.duePerDay,
      ]
    );
  }

  console.log("📚 Books seeded successfully");
};



export default seedBooks;
