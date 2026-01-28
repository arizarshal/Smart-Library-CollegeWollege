import express from "express";
import cors from "cors"
import helmet, { contentSecurityPolicy } from "helmet";
import morgan from "morgan";

// Importing routes and middleware
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import Book from "./models/book.js";
import booksData from "./data/books.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();
'/Users/ariz/Desktop/JS projects/smart library mysql'
// CORS configuration: allowed origins
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  process.env.CLIENT_URL,
];

// CORS middleware
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow Postman / server-to-server
      if (!requestOrigin) return callback(null, true);

      // Allow if in allowed origins list
      if (allowedOrigins.includes(requestOrigin)) {
        return callback(null, true);
      }

      // Disallow if not in allowed origins list
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],    // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],   // Allowed headers
  })
);

// Middleware
app.use(express.json());
app.use(helmet({crossOriginResourcePolicy: false}));

// Logger middleware (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.status(200).send("🚀 Smart Library Borrowing API is running");
});

// Routes
app.use("/api", apiLimiter);  // Apply general API rate limiter
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


// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});


export default app; 