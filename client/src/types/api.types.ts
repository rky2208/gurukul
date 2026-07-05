import type { ProviderStatusMap } from "./provider.types";

export interface StatusResponse {
  ok: boolean;
  llmConfigured: boolean;
  providers: ProviderStatusMap;
}
