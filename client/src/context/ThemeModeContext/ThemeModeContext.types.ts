import type { Accent, InkPalette, ThemeMode } from "../../styles/theme.types";

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  ink: InkPalette;
  getAccent: (accent?: string) => Accent;
}
