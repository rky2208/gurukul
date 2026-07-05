import type { ProviderName, ProviderStatus } from "../types/index.js";
import type { ChatProvider } from "./provider.types.js";
import { openaiProvider } from "./openai.provider.js";
import { anthropicProvider } from "./anthropic.provider.js";
import { geminiProvider } from "./gemini.provider.js";

const providers: Record<ProviderName, ChatProvider> = {
  openai: openaiProvider,
  anthropic: anthropicProvider,
  gemini: geminiProvider,
};

export const PROVIDER_NAMES: ProviderName[] = ["openai", "anthropic", "gemini"];

export function getProvider(name: ProviderName): ChatProvider | null {
  return providers[name] ?? null;
}

/** Which providers currently have an API key configured on the server. */
export function getProviderStatus(): ProviderStatus {
  return {
    openai: providers.openai.isConfigured(),
    anthropic: providers.anthropic.isConfigured(),
    gemini: providers.gemini.isConfigured(),
  };
}

/** First configured provider, used when the client doesn't specify one. */
export function getDefaultProvider(): ProviderName | null {
  return PROVIDER_NAMES.find((name) => providers[name].isConfigured()) ?? null;
}
