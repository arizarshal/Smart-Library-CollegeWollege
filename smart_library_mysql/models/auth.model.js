import { pool } from "../db/mysql.js";

export const AuthModel = {
  async findByEmail(email) {
    const [[user]] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return user;
  },

  async createUser({ name, email, password }) {
    const [result] = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
      `,
      [name, email, password]
    );

    return result.insertId;
  },
};
