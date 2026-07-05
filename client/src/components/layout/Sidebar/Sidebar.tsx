import Drawer from "@mui/material/Drawer";
import { useThemeMode } from "../../../context/ThemeModeContext";
import SidebarContent from "./SidebarContent";
import { SIDEBAR_WIDTH } from "./Sidebar.constants";
import type { SidebarProps } from "./Sidebar.types";

/**
 * Persistent sidebar on desktop, off-canvas temporary drawer on mobile.
 * Same content either way — `SidebarContent` is shared so the two never
 * drift out of sync.
 */
export default function Sidebar({
  personas,
  selectedId,
  onSelect,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { ink } = useThemeMode();
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
            borderColor: ink.border,
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
