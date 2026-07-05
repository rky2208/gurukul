import Box from "@mui/material/Box";
import type { Accent } from "../theme";

interface AvatarBadgeProps {
  emoji: string;
  accent: Accent;
  size?: number;
  active?: boolean;
}

/**
 * A persona's avatar: their symbol set inside a soft gradient-ringed
 * badge in their own accent. Deliberately not a photo of the real person —
 * the symbol (☕ / 🚀) plus color is each guru's signature, the way a
 * seal or monogram would be.
 */
export default function AvatarBadge({ emoji, accent, size = 40, active }: AvatarBadgeProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.46,
        flexShrink: 0,
        background: `linear-gradient(155deg, ${accent.soft}, transparent 65%)`,
        border: "1.5px solid",
        borderColor: active ? accent.main : "rgba(244,237,222,0.14)",
        boxShadow: active ? `0 0 0 3px ${accent.soft}` : "none",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
      }}
    >
      {emoji}
    </Box>
  );
}
