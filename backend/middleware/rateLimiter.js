import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                 // 10 requests per IP
  message: {
    message: "Too many attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/*  General API limiter (relaxed) */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,                // 100 requests per IP
  message: {
    message: "Too many requests. Please slow down.",
  },
});


export default authLimiter;