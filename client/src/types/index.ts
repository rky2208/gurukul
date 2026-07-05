export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
  thinking?: string;
}

export type ProviderName = "openai" | "anthropic" | "gemini";

export interface Persona {
  id: string;
  name: string;
  label: string;
  avatarEmoji: string;
  accent: string;
  suggestions: string[];
}

export type ProviderStatusMap = Record<ProviderName, boolean>;

export interface StatusResponse {
  ok: boolean;
  llmConfigured: boolean;
  providers: ProviderStatusMap;
}

export interface ChatResponse {
  reply: string;
  thinking?: string;
}
