import type { SxProps, Theme } from "@mui/material/styles";
import type { Accent } from "../../../styles/theme.types";
import type { InkPalette } from "../../../styles/theme.types";

interface BadgeStyleParams {
  size: number;
  accent: Accent;
  active?: boolean;
  ink: InkPalette;
}

export function getBadgeContainerSx({ size, accent, active, ink }: BadgeStyleParams): SxProps<Theme> {
  return {
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
  };
}

export const badgeImageSx: SxProps<Theme> = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
