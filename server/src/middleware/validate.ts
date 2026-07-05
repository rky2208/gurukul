// middleware/validate.ts
import type { NextFunction, Request, Response } from "express";
import { z, type ZodTypeAny } from "zod";

// Keeps the request body from becoming a vector for abuse: caps message
// length, how much history can be replayed, and constrains roles/providers
// to the known enums instead of trusting arbitrary client input.
export const chatBodySchema = z.object({
  personaId: z.string().trim().min(1).max(64),
  message: z.string().trim().min(1, "message can't be empty").max(4000, "message is too long"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      })
    )
    .max(40, "history is too long")
    .optional(),
  showThinking: z.boolean().optional(),
  provider: z.enum(["openai", "anthropic", "gemini"]).optional(),
});

export type ValidatedChatBody = z.infer<typeof chatBodySchema>;

/** Generic Express middleware factory: validates req.body against a zod schema. */
export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Invalid request body",
        code: "VALIDATION_ERROR",
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
