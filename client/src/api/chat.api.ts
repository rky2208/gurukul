import { API_BASE, CHAT_TIMEOUT_MS, BackendUnreachableError, fetchWithTimeout } from "./http";
import type { ChatMessage, ChatResponse, ProviderName } from "../types";

interface SendMessageParams {
  personaId: string;
  message: string;
  history: ChatMessage[];
  showThinking: boolean;
  provider?: ProviderName;
}

export async function sendMessage({
  personaId,
  message,
  history,
  showThinking,
  provider,
}: SendMessageParams): Promise<ChatResponse> {
  let res: Response;
  try {
    res = await fetchWithTimeout(
      `${API_BASE}/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaId, message, history, showThinking, provider }),
      },
      CHAT_TIMEOUT_MS
    );
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new BackendUnreachableError("That took too long to respond. Please try again.");
    }
    throw new BackendUnreachableError(
      "Can't reach the server right now. Start the backend (npm run dev in /server) to enable chat replies."
    );
  }

  let data: { error?: string } & Partial<ChatResponse> = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON response (e.g. proxy error page) — fall through to generic error below
  }

  if (!res.ok) {
    throw new Error(data.error || `Chat request failed (${res.status})`);
  }
  return data as ChatResponse;
}
