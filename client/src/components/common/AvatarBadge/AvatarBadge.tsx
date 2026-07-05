import { useState } from "react";
import Box from "@mui/material/Box";
import { useThemeMode } from "../../../context/ThemeModeContext";
import { getBadgeContainerSx, badgeImageSx } from "./AvatarBadge.styles";
import type { AvatarBadgeProps } from "./AvatarBadge.types";

/**
 * A persona's avatar. If `imageUrl` is provided (and loads successfully),
 * shows that photo inside the gradient-ringed badge. Otherwise (or if the
 * image 404s/fails to load) falls back to the emoji symbol + color, so a
 * missing/broken image file never breaks the UI.
 */
export default function AvatarBadge({ emoji, imageUrl, accent, size = 40, active }: AvatarBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const { ink } = useThemeMode();

  return (
    <Box sx={getBadgeContainerSx({ size, accent, active, ink })}>
      {showImage ? (
        <Box
          component="img"
          src={imageUrl}
          alt=""
          onError={() => setImageFailed(true)}
          sx={badgeImageSx}
        />
      ) : (
        emoji
      )}
    </Box>
  );
}
