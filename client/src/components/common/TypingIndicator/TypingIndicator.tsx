import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import { dotVariants } from "./TypingIndicator.constants";
import type { TypingIndicatorProps } from "./TypingIndicator.types";

/** Three breathing dots — used while a guru is composing a reply. */
export default function TypingIndicator({ color }: TypingIndicatorProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, px: 0.5, py: 0.75 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          custom={i}
          variants={dotVariants}
          animate="animate"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: color,
            display: "inline-block",
          }}
        />
      ))}
    </Box>
  );
}
