import type { Accent } from "../../../styles/theme.types";

export interface AvatarBadgeProps {
  emoji: string;
  imageUrl?: string;
  accent: Accent;
  size?: number;
  active?: boolean;
}
