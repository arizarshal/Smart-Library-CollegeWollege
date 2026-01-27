import mysql from "mysql2/promise";

let pool;

const connectDB = async () => {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await pool.query("SELECT 1");
  console.log("✅ MySQL connected");
};

export default connectDB;
export { pool };
