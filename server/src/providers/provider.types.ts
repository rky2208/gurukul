import type { ChatMessage } from "../types/index.js";

export interface ProviderChatParams {
  systemPrompt: string;
  /** Full turn history including the latest user message, oldest first. */
  messages: ChatMessage[];
  temperature?: number;
  /** Optional abort signal so a request can be cancelled if it's taking too long. */
  signal?: AbortSignal;
}

/** Common contract every LLM provider (OpenAI, Anthropic, Gemini, ...) must implement. */
export interface ChatProvider {
  readonly name: string;
  isConfigured(): boolean;
  chat(params: ProviderChatParams): Promise<string>;
}
