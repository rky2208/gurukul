export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

/** Supported LLM providers. Add a new one here + a provider file + factory entry. */
export type ProviderName = "openai" | "anthropic" | "gemini";

export interface Persona {
  id: string;
  name: string;
  label: string;
  avatarEmoji: string;
  avatarImage?: string;
  accent: string;
  suggestions: string[];
  /** Full system prompt text — server-side only, never sent to the client. */
  systemPrompt: string;
}

/** What we expose to the client: everything except the system prompt. */
export type PersonaPublic = Omit<Persona, "systemPrompt">;

export interface ChatRequestBody {
  personaId: string;
  message: string;
  history?: ChatMessage[];
  showThinking?: boolean;
  provider?: ProviderName;
}

export interface ParsedReply {
  thinking: string | null;
  answer: string;
}

export interface ChatResult {
  reply: string;
  thinking?: string;
}

export type ProviderStatus = Record<ProviderName, boolean>;
