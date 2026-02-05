import express from "express";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import {logger} from "./utils/logScript.js";

// Importing routes and middleware
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import Book from "./models/book.js";
import booksData from "./data/books.js";
import errorHandler from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();
app.set('trust proxy', 1)

// allow all in dev
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allowing non-browser clients (Postman, curl)
      if (!requestOrigin) return callback(null, true);

      // Allow all during development
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      const allowedOrigins = new Set([
        "http://127.0.0.1:5501",
        "http://localhost:5501",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
      ]);

      if (allowedOrigins.has(requestOrigin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet({crossOriginResourcePolicy: false}));

//  Logger middleware : For custom log in prod
// app.use(morgan("combined", {
//   skip: (req, res) => res.statusCode >= 400,
//   stream: {
//     write: (message) => logger.log(message.trim())
//   }
// }))

// For dev
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.status(200).send("🚀 Smart Library Borrowing API is running");
});

// Routes
// app.use("/api", apiLimiter);  
app.use("/auth", authRoutes);  
app.use("/books", bookRoutes);
app.use("/borrow", borrowRoutes);
app.use("/payments", paymentRoutes);
app.use("/dashboard", dashboardRoutes);


var insertBooksIfEmpty;

insertBooksIfEmpty = async () => {
  const count = await Book.countDocuments();
  console.log("Inserting books");

    await Book.insertMany(booksData);
    console.log("number of books: ", await Book.countDocuments());
    console.log("📚 Books inserted into database");
};
// insertBooksIfEmpty()

// Catch-all for unknown routes (regex works across Express versions)  
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);


export default app; 