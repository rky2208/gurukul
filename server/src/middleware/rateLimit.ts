// middleware/rateLimit.ts
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// General ceiling across all API routes.
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down and try again shortly.", code: "RATE_LIMITED" },
});

// Chat hits a paid LLM API per call, so it gets a tighter, dedicated budget
// on top of the general limiter above.
export const chatLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.CHAT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "You're sending messages faster than the guru can think. Please wait a moment.",
    code: "CHAT_RATE_LIMITED",
  },
});
