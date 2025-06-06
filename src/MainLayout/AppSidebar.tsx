import { useSidebar } from "@/components/ui/sidebar";
import { useEventStore } from "@/utils/store";
import { Page } from "@/utils/types";
import { useEffect } from "react";
import { ClassSelector } from "./components/ClassSelector";
import { DateSelector } from "./components/DateSelector";
import { ToolSwitcher } from "./components/ToolSwitcher";
import { SourceSelector } from "./components/SourceSelector";
import { CameraSelector } from "./components/CameraSelector";
import { GroupTimeRange } from "./components/GroupTimeRange";
import { LabelInput } from "./components/LabelInput";
import { RefreshCcw } from "lucide-react";
import { UserSelector } from "./components/UserSelector";

export function AppSidebar() {
  const page = useEventStore((state) => state.page);
  const setRefreshTime = useEventStore((state) => state.setRefreshTime);
  const showFilters = [Page.Events, Page.Videoclips].includes(page);

  return (
    <>
      <aside className="p-5 hidden md:flex flex-col w-16 border-r h-[100vh] items-center">
        <div className="flex flex-col space-y-4 w-full items-center">
          <ToolSwitcher />
          <div className="h-px w-full bg-black" />
          <DateSelector />
          <ClassSelector />
          <SourceSelector />
          <CameraSelector />
          {page === Page.Events && <GroupTimeRange />}
          {page === Page.Events && <LabelInput />}
          {showFilters && (
            <RefreshCcw
              className="w-[100%]"
              onClick={() => setRefreshTime(new Date().getTime())}
            />
          )}
        </div>

        <div className="flex-1" />

        <UserSelector />
      </aside>

      <div className="fixed px-2 h-[5vh] bottom-0 left-0 right-0 z-50 flex md:hidden justify-around bg-muted border-t">
        <ToolSwitcher />

        <DateSelector />
        <ClassSelector />
        <SourceSelector />
        <CameraSelector />
        {page === Page.Events && <GroupTimeRange />}
        {page === Page.Events && <LabelInput />}
        {showFilters && (
          <RefreshCcw
            className="w-[100%]"
            onClick={() => setRefreshTime(new Date().getTime())}
          />
        )}

        <UserSelector />
      </div>
    </>
  );
}
