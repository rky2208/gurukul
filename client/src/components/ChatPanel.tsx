import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MessageBubble from "./MessageBubble";
import PromptChips from "./PromptChips";
import AvatarBadge from "./AvatarBadge";
import TypingIndicator from "./TypingIndicator";
import { sendMessage } from "../api";
import { getAccent, INK } from "../theme";
import type { ChatMessage, Persona, ProviderName, ProviderStatusMap } from "../types";

const PROVIDER_LABELS: Record<ProviderName, string> = {
  openai: "OpenAI",
  anthropic: "Claude",
  gemini: "Gemini",
};

interface ChatPanelProps {
  persona: Persona;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  chatDisabled?: boolean;
  providers: ProviderStatusMap;
  provider: ProviderName | null;
  onProviderChange: (provider: ProviderName) => void;
}

export default function ChatPanel({
  persona,
  messages,
  setMessages,
  chatDisabled = false,
  providers,
  provider,
  onProviderChange,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThinking, setShowThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const color = getAccent(persona.accent);
  const firstName = persona.name.split(" ")[0];

  const availableProviders = (Object.keys(providers) as ProviderName[]).filter(
    (name) => providers[name]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text?: string) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    const nextHistory: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextHistory);
    setInput("");
    setError(null);

    if (chatDisabled) {
      setError(
        `${firstName} can't reply right now — the backend isn't reachable or no LLM provider is configured. Everything else still works.`
      );
      return;
    }

    setLoading(true);
    try {
      const data = await sendMessage({
        personaId: persona.id,
        message: trimmed,
        history: messages,
        showThinking,
        provider: provider ?? undefined,
      });
      setMessages([
        ...nextHistory,
        { role: "assistant", content: data.reply, thinking: data.thinking },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleProviderSelect(e: SelectChangeEvent) {
    onProviderChange(e.target.value as ProviderName);
  }

  return (
    <Box
      component="section"
      sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, bgcolor: "background.default" }}
    >
      <AnimatePresence mode="wait">
        <Box
          key={persona.id}
          component={motion.div}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={0}
            square
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: { xs: 1.5, md: 3 },
              py: 2,
              borderBottom: "1px solid",
              borderColor: INK.border,
              bgcolor: "background.paper",
            }}
          >
            <AvatarBadge emoji={persona.avatarEmoji} accent={color} size={44} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                {persona.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {persona.label}
              </Typography>
            </Box>

            {availableProviders.length > 0 && (
              <Tooltip title="Choose which model answers as this guru">
                <Select
                  size="small"
                  value={provider && availableProviders.includes(provider) ? provider : ""}
                  onChange={handleProviderSelect}
                  displayEmpty
                  sx={{ minWidth: { xs: 92, md: 130 }, mr: 1 }}
                >
                  {availableProviders.map((name) => (
                    <MenuItem key={name} value={name}>
                      {PROVIDER_LABELS[name]}
                    </MenuItem>
                  ))}
                </Select>
              </Tooltip>
            )}

            <Tooltip title="Reveal the guru's private reasoning alongside each reply">
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={showThinking}
                    onChange={(e) => setShowThinking(e.target.checked)}
                  />
                }
                label={<Typography variant="caption">show thinking</Typography>}
              />
            </Tooltip>
          </Paper>
        </Box>
      </AnimatePresence>

      <Box
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label={`Conversation with ${persona.name}`}
        sx={{ flex: 1, overflowY: "auto", px: { xs: 1.5, md: 3 }, py: 3 }}
      >
        {messages.length === 0 && (
          <Stack
            component={motion.div}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            spacing={2.5}
            sx={{ maxWidth: 640, mx: "auto", mt: { xs: 4, md: 7 }, textAlign: "center" }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <AvatarBadge emoji={persona.avatarEmoji} accent={color} size={64} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 600,
                  fontSize: { xs: 24, md: 30 },
                }}
              >
                Meet {persona.name}
              </Typography>
              <Typography sx={{ color: "text.secondary", mt: 0.75 }}>
                {persona.label} — ask a real question, the way you would in person.
              </Typography>
            </Box>
            <PromptChips
              suggestions={persona.suggestions}
              onPick={handleSend}
              accent={persona.accent}
              disabled={chatDisabled}
            />
          </Stack>
        )}

        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            role={m.role}
            content={m.content}
            thinking={m.thinking}
            avatarEmoji={persona.avatarEmoji}
            accent={persona.accent}
          />
        ))}

        {loading && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}
          >
            <AvatarBadge emoji={persona.avatarEmoji} accent={color} size={32} />
            <Paper
              elevation={0}
              sx={{ borderRadius: 3, borderTopLeftRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
            >
              <TypingIndicator color={color.main} />
            </Paper>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1, maxWidth: 640, mx: "auto" }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </Box>

      {messages.length > 0 && (
        <PromptChips
          suggestions={persona.suggestions}
          onPick={handleSend}
          accent={persona.accent}
          disabled={chatDisabled}
        />
      )}

      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, px: { xs: 1.5, md: 3 }, py: 2, borderTop: "1px solid", borderColor: INK.border }}>
        <TextField
          fullWidth
          multiline
          maxRows={5}
          size="small"
          placeholder={`Ask ${firstName} something...`}
          inputProps={{ "aria-label": `Message ${persona.name}` }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Tooltip title={chatDisabled ? `${firstName} can't reply right now` : "Send"}>
          <span>
            <IconButton
              component={motion.button}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              sx={{ bgcolor: color.main, color: color.contrastText, "&:hover": { bgcolor: color.main }, "&.Mui-disabled": { bgcolor: "rgba(244,237,222,0.08)" } }}
            >
              <SendRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}
