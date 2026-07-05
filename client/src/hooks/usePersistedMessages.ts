import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { readJSON, writeJSON } from "../utils/storage";
import type { MessagesByPersona } from "../types";

/**
 * Chat history keyed by persona id, persisted to localStorage on every
 * change. Persistence is best-effort — see `utils/storage.ts` — so a
 * private-browsing tab or full storage quota never breaks the chat itself.
 */
export function usePersistedMessages() {
  const [messagesByPersona, setMessagesByPersona] = useState<MessagesByPersona>(() =>
    readJSON<MessagesByPersona>(STORAGE_KEYS.chatMessages, {})
  );

  useEffect(() => {
    writeJSON(STORAGE_KEYS.chatMessages, messagesByPersona);
  }, [messagesByPersona]);

  return [messagesByPersona, setMessagesByPersona] as const;
}
