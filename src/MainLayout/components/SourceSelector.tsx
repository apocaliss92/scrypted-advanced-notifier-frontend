import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventStore } from "@/utils/store";
import { ScryptedEventSource } from "@/utils/types";
import { Projector } from "lucide-react";

export function SourceSelector() {
  const configs = useEventStore((state) => state.configs);
  const eventSource = useEventStore((state) => state.eventSource);
  const setEventSource = useEventStore((state) => state.setEventSource);
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Projector className="w-[100%]" />
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "top" : "right"}
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
