import "dotenv/config";
// env must be imported (and validated) before anything else that reads
// process.env, so a misconfigured deployment fails fast and loudly.
import { env, allowedOrigins, isProduction } from "./config/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import apiRoutes from "./routes/index.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";

const app = express();

// Behind a reverse proxy (Render, Fly, nginx, etc.) in production so
// rate-limiting and req.ip see the real client IP, not the proxy's.
if (isProduction) app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/non-browser requests (no Origin header) and
      // anything explicitly listed in ALLOWED_ORIGINS.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} is not allowed by CORS.`));
      }
    },
  })
);
app.use(express.json({ limit: "64kb" }));
app.use(
  morgan(isProduction ? "combined" : "dev", {
    stream: { write: (line) => logger.info(line.trim()) },
  })
);
app.use(apiLimiter);

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  logger.info(`Gurukul backend listening`, { port: env.PORT, env: env.NODE_ENV });
});

// Graceful shutdown so in-flight requests (e.g. a slow LLM call) get a
// chance to finish instead of being dropped when the process is stopped.
function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully`);
  server.close((err) => {
    if (err) {
      logger.error("Error during shutdown", { message: err.message });
      process.exit(1);
    }
    process.exit(0);
  });
  // Don't hang forever if something keeps a connection open.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason: String(reason) });
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", { message: err.message, stack: err.stack });
  process.exit(1);
});
