import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { getAccent, INK } from "../theme";
import AvatarBadge from "./AvatarBadge";
import type { Persona } from "../types";

export const SIDEBAR_WIDTH = 288;

interface SidebarProps {
  personas: Persona[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Mobile-only: whether the off-canvas drawer is open. */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({
  personas,
  selectedId,
  onSelect,
  onItemSelected,
  showCloseButton,
  onClose,
}: {
  personas: Persona[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onItemSelected?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}) {
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
                  "&:hover": { bgcolor: "rgba(244,237,222,0.05)" },
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

      <Divider sx={{ borderColor: INK.border }} />
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

/**
 * Persistent sidebar on desktop, off-canvas temporary drawer on mobile.
 * Same content either way — `SidebarContent` above is shared so the two
 * never drift out of sync.
 */
export default function Sidebar({
  personas,
  selectedId,
  onSelect,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Desktop: always-visible rail */}
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          [`& .MuiDrawer-paper`]: {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            position: "relative",
            borderRight: "1px solid",
            borderColor: INK.border,
            bgcolor: "background.paper",
          },
        }}
      >
        <SidebarContent
          personas={personas}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </Drawer>

      {/* Mobile: off-canvas drawer, toggled from the NavBar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .MuiDrawer-paper`]: {
            width: Math.min(SIDEBAR_WIDTH + 20, 320),
            boxSizing: "border-box",
            bgcolor: "background.paper",
          },
        }}
      >
        <SidebarContent
          personas={personas}
          selectedId={selectedId}
          onSelect={onSelect}
          onItemSelected={onMobileClose}
          showCloseButton
          onClose={onMobileClose}
        />
      </Drawer>
    </>
  );
}
