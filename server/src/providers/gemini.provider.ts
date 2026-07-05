import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatProvider, ProviderChatParams } from "./provider.types.js";
import { env } from "../config/env.js";

const MODEL = env.GEMINI_MODEL;

let client: GoogleGenerativeAI | null = null;
function getClient(): GoogleGenerativeAI | null {
  if (!env.GEMINI_API_KEY) return null;
  if (!client) {
    client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }
  return client;
}

export const geminiProvider: ChatProvider = {
  name: "gemini",

  isConfigured() {
    return Boolean(env.GEMINI_API_KEY);
  },

  // Note: the Gemini SDK's startChat/sendMessage doesn't accept an
  // AbortSignal today, so cancellation for this provider is enforced only
  // by the outer withTimeout() race in chat.service.ts (the in-flight
  // request may keep running server-side, but the client gets its
  // response/error back on time either way).
  async chat({ systemPrompt, messages, temperature = 0.8 }: ProviderChatParams) {
    const gemini = getClient();
    if (!gemini) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const model = gemini.getGenerativeModel({ model: MODEL, systemInstruction: systemPrompt });

    // Gemini's chat history is everything *except* the newest message, which
    // gets sent separately via sendMessage() below.
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const lastMessage = messages[messages.length - 1];

    const chatSession = model.startChat({ history, generationConfig: { temperature } });
    const result = await chatSession.sendMessage(lastMessage?.content ?? "");
    return result.response.text();
  },
};
