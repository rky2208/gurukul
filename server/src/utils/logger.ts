// utils/logger.ts
// A tiny structured logger. Not pulling in a heavy dependency (pino/winston)
// for an app this size, but keeping a single choke point so log shape is
// consistent and swapping in a real logger later only touches this file.

type Level = "info" | "warn" | "error";

function write(level: Level, message: string, meta?: Record<string, unknown>): void {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => write("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write("error", message, meta),
};
