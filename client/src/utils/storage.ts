/**
 * Thin, defensive wrapper around `localStorage`.
 *
 * Reads/writes are best-effort: private browsing, storage quota, or a
 * locked-down browser can all make `localStorage` throw. None of that
 * should ever break the app — worst case, a value just doesn't survive
 * a refresh.
 */

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore — the app still works for the current session, it just
    // won't survive a reload.
  }
}

export function readString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore — see readJSON/writeJSON above.
  }
}
