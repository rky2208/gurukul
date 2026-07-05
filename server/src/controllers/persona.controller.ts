import type { Request, Response } from "express";
import { listPersonas } from "../services/persona.service.js";

export function getPersonas(_req: Request, res: Response): void {
  res.json(listPersonas());
}
