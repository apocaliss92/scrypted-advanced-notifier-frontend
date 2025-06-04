import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import EventsList from "@/Events/EventsList";
import { useApi } from "@/utils/api";
import { useEventStore } from "@/utils/store";
import { Page } from "@/utils/types";
import VideoclipsList from "@/Videoclips/VideoclipsList";
import { RefreshCcw } from "lucide-react";
import { useEffectOnce } from "react-use";
import { AppSidebar } from "./AppSidebar";

export default function Layout() {
  const { getConfigs } = useApi();
  const sidebarOpen = useEventStore((state) => state.sidebarOpen);
  const setConfigs = useEventStore((state) => state.setConfigs);
  const setPage = useEventStore((state) => state.setPage);
  const setRefreshTime = useEventStore((state) => state.setRefreshTime);
  const page = useEventStore((state) => state.page);

  useEffectOnce(() => {
    getConfigs()
      .then((newConfigs) => {
        setConfigs(newConfigs);
      })
      .catch((e) => {
        if (e.response.status === 401) {
          setPage(Page.Login);
        }
      });
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {!sidebarOpen && page}
            <RefreshCcw onClick={() => setRefreshTime(new Date().getTime())} />
          </div>

          <div className="flex items-center gap-2 px-4">
            <button
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => window.location.replace(window.location.origin)}
            >
              SCRYPTED
            </button>
          </div>
        </header>
        {page === Page.Events ? (
          <EventsList />
        ) : page === Page.Videoclips ? (
          <VideoclipsList />
        ) : null}
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
