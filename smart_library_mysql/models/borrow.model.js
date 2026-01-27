import { pool } from "../db/mysql.js";

export const BorrowModel = {
  async borrowBook({ userId, bookId, days }) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1️⃣ Check user
      const [[user]] = await connection.query(
        "SELECT * FROM users WHERE id = ?",
        [userId]
      );
      if (!user) throw new Error("User not found");

      if (user.balance > 0)
        throw new Error("User has outstanding balance");

      // 2️⃣ Check active borrow
      const [[activeBorrow]] = await connection.query(
        `SELECT * FROM borrow 
         WHERE user_id = ? AND is_returned = false`,
        [userId]
      );
      if (activeBorrow)
        throw new Error("User already borrowed a book");

      // 3️⃣ Check book availability
      const [[book]] = await connection.query(
        "SELECT * FROM books WHERE id = ? AND is_borrowed = 0",
        [bookId]
      );
      if (!book) throw new Error("Book not available");

      // 4️⃣ Validate days
      if (days <= 0 || days > 7)
        throw new Error("Invalid borrow days");

      // 5️⃣ Calculate cost
      const totalCost = book.single_price_per_day * days;

      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(borrowDate.getDate() + days);

      // 6️⃣ Insert borrow record
      await connection.query(
        `
        INSERT INTO borrow
        (user_id, book_id, borrow_date, due_date, total_cost)
        VALUES (?, ?, ?, ?, ?)
        `,
        [userId, bookId, borrowDate, dueDate, totalCost]
      );

      // 7️⃣ Mark book as borrowed
      await connection.query(
        "UPDATE books SET is_borrowed = true WHERE id = ?",
        [bookId]
      );

      await connection.commit();
      return { message: "Book borrowed successfully", totalCost };

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};
