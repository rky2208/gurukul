import type { Persona } from "../../../types";

export interface SidebarProps {
  personas: Persona[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Mobile-only: whether the off-canvas drawer is open. */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export interface SidebarContentProps {
  personas: Persona[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onItemSelected?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}
