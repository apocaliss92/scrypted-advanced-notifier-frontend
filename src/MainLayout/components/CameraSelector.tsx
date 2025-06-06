import {
  Command,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventStore } from "@/utils/store";
import { Camera } from "lucide-react";

export function CameraSelector() {
  const configs = useEventStore((state) => state.configs);
  const cameras = useEventStore((state) => state.cameras);
  const setCameras = useEventStore((state) => state.setCameras);
  const isMobile = useIsMobile();

  const toggleOption = (option: string) => {
    setCameras(
      cameras.includes(option)
        ? cameras.filter((o) => o !== option)
        : [...cameras, option]
    );
  };

  const label = cameras.length ? `${cameras.length} selected` : "All";
  const allCameras = (configs?.cameras ?? [])
    .map((camera) => camera.name)
    .sort();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Camera className="w-[100%]" />
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "top" : "right"}
        className="w-auto p-0"
        align="start"
      >
        <Command>
          <CommandList
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <CommandItem onSelect={() => setCameras([])}>Reset</CommandItem>
            <CommandSeparator />
            {allCameras.map((name) => (
              <CommandItem key={name} onSelect={() => toggleOption(name)}>
                <input
                  type="checkbox"
                  checked={cameras.includes(name)}
                  readOnly
                  className="mr-2"
                />
                {name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
