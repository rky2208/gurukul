import { useState } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { NavBar, Sidebar, Footer } from "./components/layout";
import { ChatPanel } from "./components/chat";
import { BootLoader, Logo } from "./components/common";
import { useAppBoot, usePersistedMessages } from "./hooks";
import type { ChatMessage } from "./types";

export default function App() {
  const {
    personas,
    selectedId,
    setSelectedId,
    loading,
    backendDown,
    llmConfigured,
    providers,
    provider,
    setProvider,
  } = useAppBoot();
  const [messagesByPersona, setMessagesByPersona] = usePersistedMessages();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
