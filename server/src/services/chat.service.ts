import type { ChatMessage, ChatResult, ParsedReply, ProviderName } from "../types/index.js";
import { getPersona } from "./persona.service.js";
import { getProvider, getDefaultProvider } from "../providers/provider.factory.js";
import { env } from "../config/env.js";
import { withTimeout, TimeoutError } from "../utils/withTimeout.js";

export class ChatServiceError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 500, code = "CHAT_ERROR") {
    super(message);
    this.name = "ChatServiceError";
    this.status = status;
    this.code = code;
  }
}

// Pulls the <thinking>...</thinking> and <answer>...</answer> blocks out of
// the raw model output. Falls back gracefully if the model didn't follow
// the format exactly (e.g. returns the whole thing as the answer).
function parseChainOfThought(raw: string): ParsedReply {
  const thinkingMatch = raw.match(/<thinking>([\s\S]*?)<\/thinking>/i);
  const answerMatch = raw.match(/<answer>([\s\S]*?)<\/answer>/i);

  const thinking = thinkingMatch ? thinkingMatch[1].trim() : null;
  const answer = answerMatch
    ? answerMatch[1].trim()
    : raw.replace(/<\/?thinking>[\s\S]*?<\/thinking>/gi, "").trim();

  return { thinking, answer: answer || raw.trim() };
}

interface RunChatParams {
  personaId: string;
  message: string;
  history?: ChatMessage[];
  showThinking?: boolean;
  provider?: ProviderName;
}

export async function runChat({
  personaId,
  message,
  history = [],
  showThinking = false,
  provider,
}: RunChatParams): Promise<ChatResult> {
  const persona = getPersona(personaId);
  if (!persona) {
    throw new ChatServiceError(`Unknown guru: ${personaId}`, 404, "PERSONA_NOT_FOUND");
  }

  const providerName = provider ?? getDefaultProvider() ?? undefined;
  if (!providerName) {
    throw new ChatServiceError(
      "No LLM provider is configured on the server. Add an OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY to server/.env and restart. Everything else in this app works without it.",
      503,
      "LLM_NOT_CONFIGURED"
    );
  }

  const llm = getProvider(providerName);
  if (!llm || !llm.isConfigured()) {
    throw new ChatServiceError(
      `The "${providerName}" provider isn't configured on the server. Add its API key to server/.env and restart.`,
      503,
      "LLM_NOT_CONFIGURED"
    );
  }

  // Only pass the last ~10 turns to keep prompts small for this MVP.
  const trimmedHistory: ChatMessage[] = history.slice(-10).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  const controller = new AbortController();
  let raw: string;
  try {
    raw = await withTimeout(
      llm.chat({
        systemPrompt: persona.systemPrompt,
        messages: [...trimmedHistory, { role: "user", content: message }],
        signal: controller.signal,
      }),
      env.LLM_TIMEOUT_MS
    );
  } catch (err: unknown) {
    if (err instanceof TimeoutError) {
      controller.abort();
      throw new ChatServiceError(
        `${persona.name} is taking too long to respond. Please try again.`,
        504,
        "LLM_TIMEOUT"
      );
    }
    const status = (err as { status?: number })?.status || 500;
    const rawMessage = err instanceof Error ? err.message : undefined;
    const friendly =
      status === 401
        ? `${providerName} rejected the configured API key. Double-check it in server/.env.`
        : status === 429
        ? `${providerName} is rate-limiting this server right now. Please try again shortly.`
        : rawMessage || `Something went wrong talking to ${providerName}.`;
    throw new ChatServiceError(friendly, status, "LLM_REQUEST_FAILED");
  }

  const { thinking, answer } = parseChainOfThought(raw);

  return {
    reply: answer,
    thinking: showThinking && thinking ? thinking : undefined,
  };
}
