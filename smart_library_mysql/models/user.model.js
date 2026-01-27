import { pool } from "../db/mysql.js";

export const UserModel = {
  async create({ name, email }) {
    const [result] = await pool.query(
      `
      INSERT INTO users (name, email)
      VALUES (?, ?)
      `,
      [name, email]
    );

    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, name, email, balance FROM users"
    );
    return rows;
  },

  async findById(id) {
    const [[user]] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return user;
  },
};
