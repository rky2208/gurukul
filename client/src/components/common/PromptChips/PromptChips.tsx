import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useThemeMode } from "../../../context/ThemeModeContext";
import type { PromptChipsProps } from "./PromptChips.types";

export default function PromptChips({ suggestions, onPick, accent, disabled }: PromptChipsProps) {
  const { getAccent } = useThemeMode();
  if (!suggestions?.length) return null;
  const color = getAccent(accent);

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, px: 2, pb: 1.5 }}>
      {suggestions.map((s, i) => (
        <Box
          key={s}
          component={motion.div}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.04 * i }}
          whileHover={disabled ? undefined : { scale: 1.03 }}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <Chip
            label={s}
            clickable={!disabled}
            disabled={disabled}
            onClick={() => !disabled && onPick(s)}
            variant="outlined"
            sx={{
              borderColor: `${color.main}66`,
              color: color.main,
              bgcolor: color.soft,
              "&:hover": { bgcolor: color.soft, borderColor: color.main },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
