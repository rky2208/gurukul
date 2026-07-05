// middleware/errorHandler.ts
import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}`, code: "NOT_FOUND" });
}

// Express recognizes this as an error handler specifically because it takes
// 4 arguments — keep that signature even though `next` is unused.
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const status = (err as { status?: number })?.status ?? 500;
  const message = err instanceof Error ? err.message : "Something went wrong.";

  logger.error("Unhandled request error", {
    path: req.path,
    method: req.method,
    status,
    message,
  });

  if (res.headersSent) return;
  res.status(status).json({
    error: status >= 500 ? "Something went wrong on our end." : message,
    code: "INTERNAL_ERROR",
  });
}
