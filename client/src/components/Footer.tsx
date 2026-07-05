import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { INK } from "../theme";

/** Slim footer strip — sets expectations that this is an evolving MVP. */
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
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", fontSize: 11.5, textAlign: "center" }}
      >
        We're just getting started. Meet two gurus today, with more arriving
        soon. ⭐⭐
      </Typography>
    </Box>
  );
}
