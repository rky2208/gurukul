import type { Request, Response } from "express";
import { getProviderStatus } from "../providers/provider.factory.js";

// Lets the UI know upfront which providers are usable (so it can populate a
// dropdown) without having to send a chat message first. Everything else
// (personas, avatars, chips, etc.) works regardless of this flag.
export function getStatus(_req: Request, res: Response): void {
  const providers = getProviderStatus();
  const llmConfigured = Object.values(providers).some(Boolean);
  res.json({ ok: true, llmConfigured, providers });
}
