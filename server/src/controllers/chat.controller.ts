import type { NextFunction, Request, Response } from "express";
import type { ValidatedChatBody } from "../middleware/validate.js";
import { runChat, ChatServiceError } from "../services/chat.service.js";

export async function postChat(
  req: Request<unknown, unknown, ValidatedChatBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { personaId, message, history, showThinking, provider } = req.body;

  try {
    const result = await runChat({ personaId, message, history, showThinking, provider });
    res.json(result);
  } catch (err) {
    if (err instanceof ChatServiceError) {
      res.status(err.status).json({ error: err.message, code: err.code });
      return;
    }
    next(err);
  }
}
