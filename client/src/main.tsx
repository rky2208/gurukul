import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeModeProvider } from "./ThemeModeContext.tsx";
import "./index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <CssBaseline />
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeModeProvider>
  </React.StrictMode>
);