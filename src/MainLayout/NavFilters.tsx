import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { DateSelector } from "@/MainLayout/components/DateSelector";
import { ClassSelector } from "@/MainLayout/components/ClassSelector";
import { SourceSelector } from "@/MainLayout/components/SourceSelector";
import { CameraSelector } from "@/MainLayout/components/CameraSelector";
import { LabelInput } from "@/MainLayout/components/LabelInput";
import { GroupTimeRange } from "./components/GroupTimeRange";
import { useEventStore } from "@/utils/store";
import { Page, ScryptedEventSource } from "@/utils/types";

export function NavFilters({ ...props }: React.ComponentProps<"form">) {
  const eventSource = useEventStore((state) => state.eventSource);
  const page = useEventStore((state) => state.page);

  return (
    <form {...props}>
      <SidebarGroup className="py-0 flex flex-col space-y-4">
        <SidebarGroupContent className="relative">
          <DateSelector />
        </SidebarGroupContent>

        <SidebarGroupContent className="relative">
          <ClassSelector />
        </SidebarGroupContent>

        {page === Page.Events && (
          <SidebarGroupContent className="relative">
            <SourceSelector />
          </SidebarGroupContent>
        )}

        <SidebarGroupContent className="relative">
          <CameraSelector />
        </SidebarGroupContent>

        {page === Page.Events && eventSource === ScryptedEventSource.Auto && (
          <SidebarGroupContent className="relative">
            <GroupTimeRange />
          </SidebarGroupContent>
        )}

        {page === Page.Events && (
          <SidebarGroupContent className="relative">
            <LabelInput />
          </SidebarGroupContent>
        )}
      </SidebarGroup>
    </form>
  );
}
