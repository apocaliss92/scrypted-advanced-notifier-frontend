import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/utils/store";
import { ScryptedEventSource } from "@/utils/types";
import { Projector } from "lucide-react";

export function SourceSelector() {
  const configs = useEventStore((state) => state.configs);
  const eventSource = useEventStore((state) => state.eventSource);
  const setEventSource = useEventStore((state) => state.setEventSource);
  const isMobile = useIsMobile();
  const { open } = useSidebar();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {!open ? (
          <Projector />
        ) : (
          <Button
            variant={"outline"}
            className={cn("w-[100%] justify-start text-left font-normal ")}
          >
            <Projector />
            {eventSource}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "bottom" : "right"}
        className="w-auto p-0"
        align="start"
      >
        <Command>
          <CommandList>
            {[
              ScryptedEventSource.Auto,
              ...(configs?.enabledDetectionSources ?? []),
            ].map((source) => (
              <CommandItem key={source} onSelect={() => setEventSource(source)}>
                <input
                  type="checkbox"
                  checked={source === eventSource}
                  readOnly
                  className="mr-2"
                />
                {source}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    // <Select defaultValue={eventSource} onValueChange={setEventSource}>
    //   <SelectTrigger className="w-full">
    //     <span>{eventSource}</span>
    //   </SelectTrigger>
    //   <SelectContent side={isMobile ? "bottom" : "right"}>
    //     {configs?.enabledDetectionSources.map((src) => (
    //       <SelectItem key={src} value={src}>
    //         {src}
    //       </SelectItem>
    //     ))}
    //   </SelectContent>
    // </Select>
  );
}
