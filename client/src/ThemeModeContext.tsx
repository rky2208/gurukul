import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  buildTheme,
  getAccent as getAccentForMode,
  INK_BY_MODE,
  type Accent,
  type InkPalette,
  type ThemeMode,
} from "./theme";

const STORAGE_KEY = "gurukul.themeMode";

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  ink: InkPalette;
  getAccent: (accent?: string) => Accent;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  // Fall back to the visitor's OS preference the first time they show up.
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = (next: ThemeMode) => setModeState(next);
  const toggleMode = () => setModeState((m) => (m === "dark" ? "light" : "dark"));

  const muiTheme = useMemo(() => buildTheme(mode), [mode]);
  const ink = INK_BY_MODE[mode];
  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode,
      setMode,
      ink,
      getAccent: (accent?: string) => getAccentForMode(accent, mode),
    }),
    [mode, ink]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

/** Access the current theme mode, ink palette, and mode-aware accent getter from any component. */
export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return ctx;
}