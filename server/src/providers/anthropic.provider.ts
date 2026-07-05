import Anthropic from "@anthropic-ai/sdk";
import type { ChatProvider, ProviderChatParams } from "./provider.types.js";
import { env } from "../config/env.js";

const MODEL = env.ANTHROPIC_MODEL;

// Same lazy-construction pattern as the OpenAI provider — a missing key
// should never crash the server, only disable this one provider.
let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!env.ANTHROPIC_API_KEY) return null;
  if (!client) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const anthropicProvider: ChatProvider = {
  name: "anthropic",

  isConfigured() {
    return Boolean(env.ANTHROPIC_API_KEY);
  },

  async chat({ systemPrompt, messages, temperature = 0.8, signal }: ProviderChatParams) {
    const anthropic = getClient();
    if (!anthropic) {
      throw new Error("ANTHROPIC_API_KEY is not configured on the server.");
    }

    const response = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 1024,
        temperature,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      },
      { signal }
    );

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );
    return textBlock?.text || "";
  },
};
