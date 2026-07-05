import { useState } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import { getAccent } from "../theme";
import AvatarBadge from "./AvatarBadge";
import type { Role } from "../types";

interface MessageBubbleProps {
  role: Role;
  content: string;
  thinking?: string;
  avatarEmoji: string;
  avatarImage?: string;
  accent?: string;
}

export default function MessageBubble({
  role,
  content,
  thinking,
  avatarEmoji,
  avatarImage,
  accent,
}: MessageBubbleProps) {
  const [showThinking, setShowThinking] = useState(false);
  const isUser = role === "user";
  const color = getAccent(accent);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      sx={{ display: "flex", gap: 1.25, mb: 2, justifyContent: isUser ? "flex-end" : "flex-start" }}
    >
      {!isUser && <AvatarBadge emoji={avatarEmoji} imageUrl={avatarImage} accent={color} size={32} />}
      <Box sx={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.25,
            borderRadius: 3,
            border: "1px solid",
            ...(isUser
              ? {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderColor: "primary.main",
                  borderTopRightRadius: 4,
                }
              : {
                  bgcolor: "background.paper",
                  color: "text.primary",
                  borderColor: "divider",
                  borderTopLeftRadius: 4,
                }),
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {content}
          </Typography>
        </Paper>

        {!isUser && thinking && (
          <Button
            size="small"
            onClick={() => setShowThinking((s) => !s)}
            startIcon={<PsychologyOutlinedIcon fontSize="small" />}
            sx={{ mt: 0.5, color: color.main, fontSize: 12 }}
          >
            {showThinking ? "Hide the thinking" : "Show the thinking"}
          </Button>
        )}

        {!isUser && (
          <Collapse in={showThinking && Boolean(thinking)} sx={{ width: "100%" }}>
            <Paper
              variant="outlined"
              sx={{ mt: 0.5, p: 1.5, borderRadius: 2, bgcolor: color.soft, borderColor: `${color.main}55` }}
            >
              <Typography variant="caption" sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}>
                {thinking}
              </Typography>
            </Paper>
          </Collapse>
        )}
      </Box>
    </Box>
  );
}
