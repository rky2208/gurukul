import { Router } from "express";
import healthRoutes from "./health.routes.js";
import statusRoutes from "./status.routes.js";
import personaRoutes from "./persona.routes.js";
import chatRoutes from "./chat.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/status", statusRoutes);
router.use("/personas", personaRoutes);
router.use("/chat", chatRoutes);

export default router;
