import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useThemeMode } from "../../../context/ThemeModeContext";
import AvatarBadge from "../../common/AvatarBadge";
import type { SidebarContentProps } from "./Sidebar.types";

/**
 * Persona list shared by the desktop rail and the mobile drawer, so the
 * two never drift out of sync.
 */
export default function SidebarContent({
  personas,
  selectedId,
  onSelect,
  onItemSelected,
  showCloseButton,
  onClose,
}: SidebarContentProps) {
  const { ink, getAccent } = useThemeMode();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          pt: 2.5,
          pb: 1,
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", fontSize: 11 }}
        >
          The courtyard
        </Typography>
        {showCloseButton && (
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close guru list"
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <List sx={{ px: 1.25, flex: 1, overflowY: "auto" }} aria-label="Gurus">
        {personas.map((p, i) => {
          const accent = getAccent(p.accent);
          const active = p.id === selectedId;
          return (
            <Box
              key={p.id}
              component={motion.div}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i, ease: "easeOut" }}
            >
              <ListItemButton
                selected={active}
                onClick={() => {
                  onSelect(p.id);
                  onItemSelected?.();
                }}
                aria-current={active ? "true" : undefined}
                sx={{
                  borderRadius: 2.5,
                  mb: 0.75,
                  py: 1,
                  gap: 1.25,
                  alignItems: "center",
                  border: "1px solid transparent",
                  "&.Mui-selected": {
                    bgcolor: accent.soft,
                    borderColor: `${accent.main}55`,
                    "&:hover": { bgcolor: accent.soft },
                  },
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <AvatarBadge
                  emoji={p.avatarEmoji}
                  imageUrl={p.avatarImage}
                  accent={accent}
                  size={40}
                  active={active}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "text.primary",
                    }}
                  >
                    {p.name}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ fontSize: 12, color: "text.secondary" }}
                  >
                    {p.label}
                  </Typography>
                </Box>
              </ListItemButton>
            </Box>
          );
        })}
      </List>

      <Divider sx={{ borderColor: ink.border }} />
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", lineHeight: 1.5 }}
        >
          Find the guru that resonates with you and start chatting.{" "}
        </Typography>
      </Box>
    </Box>
  );
}
