import { useEventStore } from "@/utils/store";
import { Page } from "@/utils/types";
import { LucideStepBack, RefreshCcw } from "lucide-react";
import { CameraSelector } from "./components/CameraSelector";
import { ClassSelector } from "./components/ClassSelector";
import { DateSelector } from "./components/DateSelector";
import { GroupTimeRange } from "./components/GroupTimeRange";
import { LabelInput } from "./components/LabelInput";
import { SourceSelector } from "./components/SourceSelector";

export function AppSidebar() {
  const page = useEventStore((state) => state.page);
  const selectedCamera = useEventStore((state) => state.selectedCamera);
  const setSelectedCamera = useEventStore((state) => state.setSelectedCamera);
  const setRefreshTime = useEventStore((state) => state.setRefreshTime);
  const showFilters = [Page.Events, Page.Videoclips].includes(page);

  const isCameraPage = page === Page.Live && selectedCamera;

  return (
    <>
      <aside className="p-5 hidden md:flex flex-col w-16 border-r h-[90vh] items-center">
        <div className="flex flex-col space-y-4 w-full items-center">
          {showFilters && <DateSelector />}
          {showFilters && <ClassSelector />}
          {showFilters && <SourceSelector />}
          {showFilters && <CameraSelector />}
          {page === Page.Events && <GroupTimeRange />}
          {page === Page.Events && <LabelInput />}
          {showFilters && (
            <RefreshCcw
              className="w-[100%]"
              onClick={() => setRefreshTime(new Date().getTime())}
            />
          )}
          {isCameraPage && (
            <LucideStepBack
              className="w-8 h-8 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              onClick={() => setSelectedCamera(undefined)}
            />
          )}
        </div>
      </aside>

      <div className="fixed px-2 h-[5vh] bottom-0 left-0 right-0 z-50 flex md:hidden justify-around bg-muted border-t">
        {showFilters && <DateSelector />}
        {showFilters && <ClassSelector />}
        {showFilters && <SourceSelector />}
        {showFilters && <CameraSelector />}
        {page === Page.Events && <GroupTimeRange />}
        {page === Page.Events && <LabelInput />}
        {showFilters && (
          <RefreshCcw
            className="w-[100%]"
            onClick={() => setRefreshTime(new Date().getTime())}
          />
        )}
        {isCameraPage && (
          <LucideStepBack
            className="w-8 h-8 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            onClick={() => setSelectedCamera(undefined)}
          />
        )}
      </div>
    </>
  );
}
