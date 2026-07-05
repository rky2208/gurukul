import { motion } from "framer-motion";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Logo from "./Logo";

/**
 * Full-screen loading state shown while personas/status are being fetched.
 * A lit diya instead of a generic spinner — the same motif reused as the
 * brand mark, so the very first thing a person sees is on-brand.
 */
export default function BootLoader() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", width: "100vw", gap: 2.5, bgcolor: "background.default" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size={56} />
      </motion.div>
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          letterSpacing: 1,
          color: "text.secondary",
          fontSize: 13,
          textTransform: "uppercase",
        }}
      >
        Lighting the courtyard…
      </Typography>
    </Stack>
  );
}
