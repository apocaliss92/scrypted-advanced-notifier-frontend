import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EventsList from "@/Events/EventsList";
import Live from "@/Live/Live";
import { useApi } from "@/utils/api";
import { useScryptedClientContext } from "@/utils/scryptedClient";
import { useEventStore } from "@/utils/store";
import { Page } from "@/utils/types";
import VideoclipsList from "@/Videoclips/VideoclipsList";
import { useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

export default function Layout() {
  const setConfigs = useEventStore((state) => state.setConfigs);
  const page = useEventStore((state) => state.page);
  const client = useScryptedClientContext();
  const { getConfigs } = useApi();

  useEffect(() => {
    if (client) {
      getConfigs().then((configs) => {
        setConfigs(configs);
      });
    }
  }, [client]);

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
