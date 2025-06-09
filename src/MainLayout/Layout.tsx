import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EventsList from "@/Events/EventsList";
import Live from "@/Live/Live";
import { useApi } from "@/utils/api";
import { useEventStore } from "@/utils/store";
import { Page } from "@/utils/types";
import VideoclipsList from "@/Videoclips/VideoclipsList";
import { useEffectOnce } from "react-use";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

export default function Layout() {
  const { getConfigs } = useApi();
  const setConfigs = useEventStore((state) => state.setConfigs);
  const setPage = useEventStore((state) => state.setPage);
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
    <>
      <Header />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-[90vh]">
          <div className="overflow-auto h-[90vh] md:h-[90vh]">
            {page === Page.Events ? (
              <EventsList />
            ) : page === Page.Videoclips ? (
              <VideoclipsList />
            ) : page === Page.Live ? (
              <Live />
            ) : null}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
