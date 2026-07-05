// config/env.ts
// Parses and validates process.env once at startup. Fail fast with a clear
// message if something required is malformed, instead of the server limping
// along with `undefined` scattered through the codebase.

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5001),

  // Comma-separated list of origins allowed to call this API in production,
  // e.g. "https://gurukul.app,https://www.gurukul.app". In development we
  // default to allowing the Vite dev server.
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),

  // Per-IP request budgets. Chat is more expensive (LLM calls cost money),
  // so it gets its own, stricter window.
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  CHAT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),

  // Upper bound on how long we'll wait on an LLM provider before giving up.
  LLM_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-6"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-1.5-flash"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const allowedOrigins = env.ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const isProduction = env.NODE_ENV === "production";
