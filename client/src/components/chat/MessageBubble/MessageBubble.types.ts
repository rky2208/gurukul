import type { Role } from "../../../types";

export interface MessageBubbleProps {
  role: Role;
  content: string;
  thinking?: string;
  avatarEmoji: string;
  avatarImage?: string;
  accent?: string;
}
