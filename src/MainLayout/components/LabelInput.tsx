import { Popover, PopoverContent } from "@/components/ui/popover";
import { SidebarInput } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventStore } from "@/utils/store";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Search } from "lucide-react";

export function LabelInput() {
  const filter = useEventStore((state) => state.filter);
  const setFilter = useEventStore((state) => state.setFilter);
    const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Search className="w-[100%]" />
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "top" : "right"}
        className="w-auto p-0"
        align="start"
      >
        <SidebarInput
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
          placeholder="Search labels"
          className="pl-8"
        />
      </PopoverContent>
    </Popover>
  );
}
