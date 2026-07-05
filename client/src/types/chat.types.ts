export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
  /** Optional model "thinking" trace, shown behind a reveal toggle. */
  thinking?: string;
}

export interface ChatResponse {
  reply: string;
  thinking?: string;
}

/** Chat history keyed by persona id, as persisted to storage. */
export type MessagesByPersona = Record<string, ChatMessage[]>;
