import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { INK } from "../theme";

/** Slim footer strip — sets expectations that this is an evolving MVP,
 * and that replies are AI-generated, not the real people. */
export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 0.85,
        borderTop: "1px solid",
        borderColor: INK.border,
        bgcolor: INK.surface,
      }}
    >
      <Stack spacing={0.15} sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontSize: 11.5 }}
        >
          Gurukul is a young courtyard — today it's two gurus, more are on their way.
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.disabled", fontSize: 10.5 }}
        >
          Replies are AI-generated for learning &amp; demo purposes only — not written by, reviewed
          by, or an official statement from the real Hitesh or Piyush. May be inaccurate or out of
          character; always verify anything important elsewhere.
        </Typography>
      </Stack>
    </Box>
  );
}

