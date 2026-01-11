import express from "express";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet({crossOriginResourcePolicy: false,}));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Smart Library Borrowing API 🚀");
});

app.use("/api", apiLimiter);
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/borrow", borrowRoutes);
app.use("/payments", paymentRoutes);
app.use("/dashboard", dashboardRoutes);


app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
