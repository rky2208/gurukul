import { createTheme } from "@mui/material/styles";

export interface Accent {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
  soft: string;
}


export const INK = {
  bg: "#1c1730", // deep aubergine-ink page background
  surface: "#241d3d", // panels, sidebar
  surfaceRaised: "#2e2650", // cards, incoming bubbles, inputs
  border: "rgba(244, 237, 222, 0.09)",
  borderStrong: "rgba(244, 237, 222, 0.16)",
  textPrimary: "#f5efe2", // warm ivory
  textSecondary: "#b4a9d6",
  textMuted: "#8a7fb0",
};

export const FLAME = "#f2a93c"; // marigold / diya flame — primary accent

export const ACCENTS: Record<string, Accent> = {
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

export function getAccent(accent?: string): Accent {
  return (accent && ACCENTS[accent]) || ACCENTS.teal;
}

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: FLAME,
      contrastText: "#241505",
    },
    secondary: {
      main: ACCENTS.teal.main,
    },
    background: {
      default: INK.bg,
      paper: INK.surface,
    },
    divider: INK.border,
    text: {
      primary: INK.textPrimary,
      secondary: INK.textSecondary,
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
          backgroundColor: INK.bg,
          backgroundImage:
            "radial-gradient(60% 50% at 15% -10%, rgba(242,169,60,0.10), transparent 60%), radial-gradient(50% 40% at 100% 0%, rgba(43,191,164,0.08), transparent 60%)",
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
            backgroundColor: INK.surfaceRaised,
          },
        },
      },
    },
  },
});

export default theme;
