import express from "express";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import bookRoutes from "./routes/book.routes.js";
import borrowRoutes from "./routes/borrow.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

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



app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});


export default app;