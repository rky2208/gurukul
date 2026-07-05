import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import Logo from "../../common/Logo";
import { useThemeMode } from "../../../context/ThemeModeContext";
import type { NavBarProps } from "./NavBar.types";

/** Slim global top bar: brand mark, product name, live guru count, and the dark/light switch. */
export default function NavBar({ guruCount, onMenuClick }: NavBarProps) {
  const { mode, toggleMode, ink } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Box
      component={motion.header}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 1.5, md: 3 },
        py: 1.25,
        borderBottom: "1px solid",
        borderColor: ink.border,
        bgcolor: ink.surface,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <IconButton
          onClick={onMenuClick}
          aria-label="Open guru list"
          sx={{ display: { xs: "inline-flex", md: "none" }, color: "text.primary" }}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Box sx={{ color: "text.primary" }}>
          <Logo size={26} />
        </Box>
        <Stack spacing={0} sx={{ ml: 0.5 }}>
          <Typography
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 600,
              fontSize: 19,
              lineHeight: 1,
              letterSpacing: 0.2,
            }}
          >
            Gurukul
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontSize: 11, letterSpacing: 0.3, display: { xs: "none", sm: "block" } }}
          >
            Sit down with an AI guru
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton
            onClick={toggleMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            size="small"
            sx={{
              color: "text.secondary",
              border: "1px solid",
              borderColor: ink.border,
              "&:hover": { borderColor: ink.borderStrong },
            }}
          >
            {isDark ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="More gurus are joining the courtyard soon">
          <Box
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: { xs: 11, md: 12 },
              fontWeight: 600,
              letterSpacing: 0.4,
              color: "primary.main",
              border: "1px solid",
              borderColor: "rgba(242,169,60,0.35)",
              bgcolor: "rgba(242,169,60,0.08)",
              borderRadius: 999,
              px: { xs: 1, md: 1.5 },
              py: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            {guruCount} {guruCount === 1 ? "guru" : "gurus"} · MVP
          </Box>
        </Tooltip>
      </Stack>
    </Box>
  );
}
