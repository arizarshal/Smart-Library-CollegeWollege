import { pool } from "../db/mysql.js";

export const BookModel = {
  async getAvailableBooks() {
    const [rows] = await pool.query(
      `SELECT 
        id,
        title,
        author,
        single_price_per_day,
        group_price_per_day,
        image,
        due_per_day
       FROM books
       WHERE is_borrowed = false`
    );

    return rows;
  }
};
