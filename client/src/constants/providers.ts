import type { ProviderName, ProviderStatusMap } from "../types";

/** Human-readable display names for each supported LLM provider. */
export const PROVIDER_LABELS: Record<ProviderName, string> = {
  openai: "OpenAI",
  anthropic: "Claude",
  gemini: "Gemini",
};

export const EMPTY_PROVIDERS: ProviderStatusMap = {
  openai: false,
  anthropic: false,
  gemini: false,
};

// Model picker and "show thinking" are dev/debug controls, not meant for
// end users in production. They're on automatically in `npm run dev`
// (import.meta.env.DEV is set by Vite), and off in a production build
// unless explicitly forced on via VITE_SHOW_DEV_CONTROLS=true (handy for a
// staging deploy where you still want them visible).
export const SHOW_DEV_CONTROLS =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_DEV_CONTROLS === "true";
