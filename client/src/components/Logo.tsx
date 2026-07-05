import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import { FLAME } from "../theme";

interface LogoProps {
  size?: number;
  animated?: boolean;
}

/**
 * The Gurukul mark: a diya (oil lamp) flame cradled by two hands / an arch.
 * Used as the brand mark in the navbar, sidebar, and as the loading motif —
 * the one signature visual element the whole product is built around.
 */
export default function Logo({ size = 28, animated = true }: LogoProps) {
  const flame = (
    <motion.path
      d="M16 5.5c2.6 3.4 3.9 6 3.9 8.6 0 2.3-1.7 4-3.9 4s-3.9-1.7-3.9-4c0-2.6 1.3-5.2 3.9-8.6z"
      fill={FLAME}
      animate={
        animated
          ? { scale: [1, 1.08, 1], opacity: [1, 0.85, 1] }
          : undefined
      }
      transition={
        animated
          ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      style={{ transformOrigin: "16px 14px" }}
    />
  );

  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      sx={{ width: size, height: size, display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 27c0-6.1 4.5-11 10-11s10 4.9 10 11"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity={0.55}
      />
      {flame}
    </Box>
  );
}
