// In dev this stays "/api" and goes through the Vite proxy in vite.config.ts.
// In a production build, point VITE_API_URL at the deployed backend's origin
// (e.g. https://api.gurukul.app) — see client/.env.example.
// Trailing slash is stripped so a value like "https://x.com/" doesn't produce
// a double slash ("https://x.com//api/...").
const rawApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
export const API_BASE = rawApiUrl ? `${rawApiUrl}/api` : "/api";

// Generous enough to tolerate a cold start on free-tier hosts (e.g. Render
// free web services can take 30-60s to wake from sleep on the first request).
export const GET_TIMEOUT_MS = 45_000;
export const CHAT_TIMEOUT_MS = 35_000; // a little above the server's own LLM_TIMEOUT_MS

/** Thrown when the backend itself can't be reached at all (server down,
 * network error, or the request timed out) — as opposed to the backend
 * responding with an error. */
export class BackendUnreachableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackendUnreachableError";
  }
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function get<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetchWithTimeout(`${API_BASE}${path}`, {}, GET_TIMEOUT_MS);
  } catch {
    throw new BackendUnreachableError("Could not reach the backend server.");
  }
  if (!res.ok) throw new Error(`Request to ${path} failed (${res.status})`);
  return (await res.json()) as T;
}
