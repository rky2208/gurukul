import OpenAI from "openai";
import type { ChatProvider, ProviderChatParams } from "./provider.types.js";
import { env } from "../config/env.js";

const MODEL = env.OPENAI_MODEL;

// The OpenAI SDK throws immediately if constructed without an API key, and
// we don't want a missing key to crash the whole server — everything else
// (persona list, avatars, health/status checks) should keep working even
// when no key is configured. So we only construct the client lazily, right
// before an actual chat request that has a key to use.
let client: OpenAI | null = null;
function getClient(): OpenAI | null {
  if (!env.OPENAI_API_KEY) return null;
  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return client;
}

export const openaiProvider: ChatProvider = {
  name: "openai",

  isConfigured() {
    return Boolean(env.OPENAI_API_KEY);
  },

  async chat({ systemPrompt, messages, temperature = 0.8, signal }: ProviderChatParams) {
    const openai = getClient();
    if (!openai) {
      throw new Error("OPENAI_API_KEY is not configured on the server.");
    }

    const completion = await openai.chat.completions.create(
      {
        model: MODEL,
        temperature,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      },
      { signal }
    );

    return completion.choices[0]?.message?.content || "";
  },
};
