export type ThemeMode = "dark" | "light";

export interface Accent {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
  soft: string;
}

export interface InkPalette {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  hoverOverlay: string;
  disabledOverlay: string;
}
