import { useState } from "react";
import { sendMessage } from "../../../api";
import type { ChatMessage, Persona, ProviderName } from "../../../types";

interface UseChatControllerParams {
  persona: Persona;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  chatDisabled: boolean;
  showThinking: boolean;
  provider: ProviderName | null;
}

/**
 * Encapsulates the "send a message" flow: optimistic user-message append,
 * the disabled/offline guard, the network call, and error handling. Kept
 * out of the component so `ChatPanel.tsx` stays focused on markup.
 */
export function useChatController({
  persona,
  messages,
  setMessages,
  chatDisabled,
  showThinking,
  provider,
}: UseChatControllerParams) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = persona.name.split(" ")[0];

  async function handleSend(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    const nextHistory: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextHistory);
    setInput("");
    setError(null);

    if (chatDisabled) {
      setError(
        `${firstName} can't reply right now — the backend isn't reachable or no LLM provider is configured. Everything else still works.`
      );
      return;
    }

    setLoading(true);
    try {
      const data = await sendMessage({
        personaId: persona.id,
        message: trimmed,
        history: messages,
        showThinking,
        provider: provider ?? undefined,
      });
      setMessages([
        ...nextHistory,
        { role: "assistant", content: data.reply, thinking: data.thinking },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return {
    input,
    setInput,
    loading,
    error,
    setError,
    firstName,
    handleSend,
  };
}
