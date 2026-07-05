import { Component, type ErrorInfo, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "./Logo";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time errors anywhere below it so a single broken component
 * can't blank the whole app. Shows an on-brand recovery screen instead of a
 * white page, and lets the person reload without losing their bearings.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In a real deployment, send this to an error-reporting service
    // (Sentry, etc.) instead of just the console.
    console.error("Gurukul crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100vh", width: "100vw", gap: 2, px: 3, textAlign: "center", bgcolor: "background.default" }}
      >
        <Box sx={{ color: "text.primary" }}>
          <Logo size={44} animated={false} />
        </Box>
        <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, fontSize: 22 }}>
          The courtyard hit a snag
        </Typography>
        <Typography sx={{ color: "text.secondary", maxWidth: 420 }}>
          Something went wrong on this screen. Your chat history is safe — reloading usually fixes it.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reload Gurukul
        </Button>
      </Stack>
    );
  }
}
