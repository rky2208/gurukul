import { useEffect, useState } from "react";
import { fetchPersonas, fetchStatus, BackendUnreachableError } from "../api";
import { EMPTY_PROVIDERS } from "../constants/providers";
import defaultPersonas from "../data/defaultPersonas";
import type { Persona, ProviderName, ProviderStatusMap } from "../types";

interface AppBootState {
  personas: Persona[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  loading: boolean;
  backendDown: boolean;
  llmConfigured: boolean;
  providers: ProviderStatusMap;
  provider: ProviderName | null;
  setProvider: (provider: ProviderName) => void;
}

/**
 * Fetches personas + backend status once on mount. If the backend can't be
 * reached (or errors), falls back to a fully local, offline persona list so
 * the UI (sidebar, avatars, chips, layout) still works — only real chat
 * replies require the live server.
 */
export function useAppBoot(): AppBootState {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [llmConfigured, setLlmConfigured] = useState(true);
  const [providers, setProviders] = useState<ProviderStatusMap>(EMPTY_PROVIDERS);
  const [provider, setProvider] = useState<ProviderName | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const [list, status] = await Promise.all([fetchPersonas(), fetchStatus()]);
        if (cancelled) return;
        setPersonas(list);
        setSelectedId(list[0]?.id ?? null);
        setLlmConfigured(Boolean(status.llmConfigured));
        setProviders(status.providers);
        const firstConfigured = (Object.keys(status.providers) as ProviderName[]).find(
          (name) => status.providers[name]
        );
        setProvider(firstConfigured ?? null);
        setBackendDown(false);
      } catch (err) {
        if (cancelled) return;
        // Backend is unreachable (or errored) — fall back to a fully local,
        // offline persona list so the UI (sidebar, avatars, chips, layout)
        // still works. Only real chat replies require the live server.
        const isUnreachable = err instanceof BackendUnreachableError;
        setPersonas(defaultPersonas);
        setSelectedId(defaultPersonas[0]?.id ?? null);
        setLlmConfigured(false);
        setProviders(EMPTY_PROVIDERS);
        setBackendDown(true);
        if (!isUnreachable) {
          console.warn(
            "Falling back to offline persona list:",
            err instanceof Error ? err.message : err
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    personas,
    selectedId,
    setSelectedId,
    loading,
    backendDown,
    llmConfigured,
    providers,
    provider,
    setProvider,
  };
}
