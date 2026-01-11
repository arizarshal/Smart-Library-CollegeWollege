// require("dotenv").config();
import express, {  json } from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
const { connect, connection } = mongoose;
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import Book from './models/book.js';
import booksData from './data/books.js';
import borrowRoutes from "./routes/borrowRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

config();

const app = express();

app.use(cors());
app.use(json());


connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully", connection.name);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });


const insertBooksIfEmpty = async () => {
  
  const count = await Book.countDocuments();
  console.log("Inserting books");
  if (count === 0) {
    await Book.insertMany(booksData);
    console.log("📚 Books inserted into database");
  }
};

// insertBooksIfEmpty();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/borrow", borrowRoutes);
app.use("/payments", paymentRoutes);
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
