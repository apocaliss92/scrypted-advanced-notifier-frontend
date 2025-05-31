import { SidebarInput, useSidebar } from "@/components/ui/sidebar";
import { useEventStore } from "@/utils/store";
import { Search } from "lucide-react";

export function LabelInput() {
  const { open } = useSidebar();
  const filter = useEventStore((state) => state.filter);
  const setFilter = useEventStore((state) => state.setFilter);

  return open ? (
    <>
      <SidebarInput
        value={filter}
        onChange={(ev) => setFilter(ev.target.value)}
        placeholder="Search labels"
        className="pl-8"
      />
      <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
    </>
  ) : null;
}
