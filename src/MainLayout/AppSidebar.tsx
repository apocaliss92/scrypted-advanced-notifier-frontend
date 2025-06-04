import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavFilters } from "./NavFilters";
import { NavUser } from "./NavUser";
import { TeamSwitcher } from "./ToolSwitcher";
import { useEventStore } from "@/utils/store";
import { useEffect } from "react";

export function AppSidebar() {
  const setSidebarOpen = useEventStore((state) => state.setSidebarOpen);
  const { open } = useSidebar();

  useEffect(() => setSidebarOpen(open), [open]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavFilters />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
