import { createTheme, type Theme } from "@mui/material/styles";

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

/** Dark mode: deep aubergine-ink, as before. */
export const INK_DARK: InkPalette = {
  bg: "#1c1730",
  surface: "#241d3d",
  surfaceRaised: "#2e2650",
  border: "rgba(244, 237, 222, 0.09)",
  borderStrong: "rgba(244, 237, 222, 0.16)",
  textPrimary: "#f5efe2",
  textSecondary: "#b4a9d6",
  textMuted: "#8a7fb0",
  hoverOverlay: "rgba(244, 237, 222, 0.05)",
  disabledOverlay: "rgba(244, 237, 222, 0.08)",
};

/** Light mode: muted plum/heather paper — softer sibling of the dark ink, not a generic white/purple reset. */
export const INK_LIGHT: InkPalette = {
  bg: "#f3eef2",
  surface: "#faf7f9",
  surfaceRaised: "#e9dde7",
  border: "rgba(58, 40, 66, 0.10)",
  borderStrong: "rgba(58, 40, 66, 0.18)",
  textPrimary: "#2e2032",
  textSecondary: "#6b5768",
  textMuted: "#9c8b97",
  hoverOverlay: "rgba(58, 40, 66, 0.05)",
  disabledOverlay: "rgba(58, 40, 66, 0.08)",
};

export const INK_BY_MODE: Record<ThemeMode, InkPalette> = {
  dark: INK_DARK,
  light: INK_LIGHT,
};

/** The diya flame mark — same marigold in both modes (decorative icon, not text). */
export const FLAME = "#f2a93c";

/** Primary color actually used as MUI `primary.main` — needs to stay legible as text/button-fill in each mode. */
export const FLAME_BY_MODE: Record<ThemeMode, { main: string; contrastText: string }> = {
  dark: { main: "#f2a93c", contrastText: "#241505" },
  light: { main: "#a8651a", contrastText: "#fff8ec" },
};

export const ACCENTS_DARK: Record<string, Accent> = {
  amber: {
    main: "#f2a93c",
    light: "#ffd98a",
    dark: "#b9761c",
    contrastText: "#241505",
    soft: "rgba(242, 169, 60, 0.14)",
  },
  teal: {
    main: "#2bbfa4",
    light: "#8fe6d4",
    dark: "#137a67",
    contrastText: "#04211b",
    soft: "rgba(43, 191, 164, 0.14)",
  },
  oxblood: {
    main: "#d5697a",
    light: "#f2a9b6",
    dark: "#8c2e3d",
    contrastText: "#2a0a10",
    soft: "rgba(213, 105, 122, 0.14)",
  },
};

/** Light-mode accents reuse the dark mode's `dark` stop as the new `main`, so accent text keeps AA contrast on light paper. */
export const ACCENTS_LIGHT: Record<string, Accent> = {
  amber: {
    main: "#a8651a",
    light: "#f2a93c",
    dark: "#6e4110",
    contrastText: "#fff8ec",
    soft: "rgba(168, 101, 26, 0.12)",
  },
  teal: {
    main: "#0f6e56",
    light: "#2bbfa4",
    dark: "#085041",
    contrastText: "#eafbf6",
    soft: "rgba(15, 110, 86, 0.12)",
  },
  oxblood: {
    main: "#8c2e3d",
    light: "#d5697a",
    dark: "#5e1c27",
    contrastText: "#fdecee",
    soft: "rgba(140, 46, 61, 0.12)",
  },
};

export const ACCENTS_BY_MODE: Record<ThemeMode, Record<string, Accent>> = {
  dark: ACCENTS_DARK,
  light: ACCENTS_LIGHT,
};

export function getAccent(accent: string | undefined, mode: ThemeMode = "dark"): Accent {
  const set = ACCENTS_BY_MODE[mode];
  return (accent && set[accent]) || set.teal;
}

function backgroundImageFor(mode: ThemeMode): string {
  if (mode === "dark") {
    return "radial-gradient(60% 50% at 15% -10%, rgba(242,169,60,0.10), transparent 60%), radial-gradient(50% 40% at 100% 0%, rgba(43,191,164,0.08), transparent 60%)";
  }
  // Light mode: no gradient wash — flat parchment reads calmer and avoids a "hero section" look.
  return "none";
}

export function buildTheme(mode: ThemeMode): Theme {
  const ink = INK_BY_MODE[mode];
  const flame = FLAME_BY_MODE[mode];
  const accents = ACCENTS_BY_MODE[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: flame.main,
        contrastText: flame.contrastText,
      },
      secondary: {
        main: accents.teal.main,
      },
      background: {
        default: ink.bg,
        paper: ink.surface,
      },
      divider: ink.border,
      text: {
        primary: ink.textPrimary,
        secondary: ink.textSecondary,
      },
      action: {
        hover: ink.hoverOverlay,
        disabledBackground: ink.disabledOverlay,
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Fraunces", serif' },
      h2: { fontFamily: '"Fraunces", serif' },
      h3: { fontFamily: '"Fraunces", serif' },
      h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
      button: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        textTransform: "none",
        fontWeight: 600,
        letterSpacing: 0.2,
      },
      overline: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        letterSpacing: 1.6,
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: ink.bg,
            backgroundImage: backgroundImageFor(mode),
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 12,
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              backgroundColor: ink.surfaceRaised,
            },
          },
        },
      },
    },
  });
}

const theme = buildTheme("dark");
export default theme;