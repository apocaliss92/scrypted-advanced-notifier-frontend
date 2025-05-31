"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEventStore } from "@/utils/store";
import { Page } from "@/utils/types";
import { GalleryThumbnails } from "lucide-react";

interface Tool {
  name: string;
  logo: React.ElementType;
  page: Page;
}

const tools: Tool[] = [
  {
    name: "Events",
    logo: GalleryThumbnails,
    page: Page.Events,
  },
];

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const page = useEventStore((state) => state.page);
  const setPage = useEventStore((state) => state.setPage);

  const activeTool = tools.find((tool) => tool.page === page);

  if (!activeTool) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTool.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTool.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {tools.map((tool) => (
              <DropdownMenuItem
                key={tool.name}
                onClick={() => setPage(tool.page)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <tool.logo className="size-4 shrink-0" />
                </div>
                {tool.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
