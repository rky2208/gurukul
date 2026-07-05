import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BootLoader from "./components/BootLoader";
import Logo from "./components/Logo";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import { fetchPersonas, fetchStatus, BackendUnreachableError } from "./api";
import defaultPersonas from "./data/defaultPersonas";
import type { ChatMessage, Persona, ProviderName, ProviderStatusMap } from "./types";

const EMPTY_PROVIDERS: ProviderStatusMap = { openai: false, anthropic: false, gemini: false };
const MESSAGES_STORAGE_KEY = "gurukul:messages:v1";

// Chat history persistence is best-effort: private browsing, storage quota,
// or a locked-down browser can all make localStorage throw. None of that
// should ever break the app — worst case, history just doesn't survive a
// refresh.
function loadStoredMessages(): Record<string, ChatMessage[]> {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ChatMessage[]>) : {};
  } catch {
    return {};
  }
}

function persistMessages(messages: Record<string, ChatMessage[]>): void {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore — chat still works for the current session, it just won't
    // survive a reload.
  }
}

export default function App() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messagesByPersona, setMessagesByPersona] = useState<Record<string, ChatMessage[]>>(() =>
    loadStoredMessages()
  );
  const [loading, setLoading] = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [llmConfigured, setLlmConfigured] = useState(true);
  const [providers, setProviders] = useState<ProviderStatusMap>(EMPTY_PROVIDERS);
  const [provider, setProvider] = useState<ProviderName | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
          console.warn("Falling back to offline persona list:", err instanceof Error ? err.message : err);
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

  // Persist chat history whenever it changes so a refresh doesn't lose it.
  useEffect(() => {
    persistMessages(messagesByPersona);
  }, [messagesByPersona]);

  const selectedPersona = personas.find((p) => p.id === selectedId);

  function setMessagesForSelected(next: ChatMessage[]) {
    if (!selectedId) return;
    setMessagesByPersona((prev) => ({ ...prev, [selectedId]: next }));
  }

  if (loading) {
    return <BootLoader />;
  }

  if (!selectedPersona) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh", p: 4, gap: 2 }}>
        <Box sx={{ color: "text.primary" }}>
          <Logo size={40} animated={false} />
        </Box>
        <Alert severity="error" sx={{ maxWidth: 480 }}>
          No gurus are available right now. Please check the server configuration.
        </Alert>
      </Stack>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
      <NavBar guruCount={personas.length} onMenuClick={() => setMobileSidebarOpen(true)} />

      {backendDown && (
        <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert severity="warning" variant="filled" sx={{ borderRadius: 0 }}>
            The server isn't reachable — you're seeing an offline preview of the courtyard. Start it
            (<code>npm run dev</code> in <code>/server</code>) so the gurus can actually reply.
          </Alert>
        </Box>
      )}
      {!backendDown && !llmConfigured && (
        <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert severity="info" variant="filled" sx={{ borderRadius: 0 }}>
            No LLM provider key is configured on the server — browsing works fine, but replies are
            paused until one of <code>OPENAI_API_KEY</code>, <code>ANTHROPIC_API_KEY</code>, or{" "}
            <code>GEMINI_API_KEY</code> is set in <code>server/.env</code>.
          </Alert>
        </Box>
      )}

      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          personas={personas}
          selectedId={selectedId}
          onSelect={setSelectedId}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <ChatPanel
          persona={selectedPersona}
          messages={(selectedId && messagesByPersona[selectedId]) || []}
          setMessages={setMessagesForSelected}
          chatDisabled={backendDown || !llmConfigured}
          providers={providers}
          provider={provider}
          onProviderChange={setProvider}
        />
      </Box>

      <Footer />
    </Box>
  );
}
