import { useState } from "react";
import Box from "@mui/material/Box";
import type { Accent } from "../theme";
import { useThemeMode } from "../ThemeModeContext";

interface AvatarBadgeProps {
  emoji: string;
  imageUrl?: string;
  accent: Accent;
  size?: number;
  active?: boolean;
}

/**
 * A persona's avatar. If `imageUrl` is provided (and loads successfully),
 * shows that photo inside the gradient-ringed badge. Otherwise (or if the
 * image 404s/fails to load) falls back to the emoji symbol + color, so a
 * missing/broken image file never breaks the UI.
 *
 */
export default function AvatarBadge({ emoji, imageUrl, accent, size = 40, active }: AvatarBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const { ink } = useThemeMode();

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
        overflow: "hidden",
        background: `linear-gradient(155deg, ${accent.soft}, transparent 65%)`,
        border: "1.5px solid",
        borderColor: active ? accent.main : ink.borderStrong,
        boxShadow: active ? `0 0 0 3px ${accent.soft}` : "none",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={imageUrl}
          alt=""
          onError={() => setImageFailed(true)}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        emoji
      )}
    </Box>
  );
}