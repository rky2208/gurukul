import { Router } from "express";
import { postChat } from "../controllers/chat.controller.js";
import { validateBody, chatBodySchema } from "../middleware/validate.js";
import { chatLimiter } from "../middleware/rateLimit.js";

const router = Router();
router.post("/", chatLimiter, validateBody(chatBodySchema), postChat);

export default router;
