import type { Request, Response } from "express";

const startedAt = Date.now();

export function getHealth(_req: Request, res: Response): void {
  res.json({ ok: true, uptimeSeconds: Math.round((Date.now() - startedAt) / 1000) });
}
