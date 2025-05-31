import { Button } from "@/components/ui/button";
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
import { useSidebar } from "@/components/ui/sidebar";
import { DetectionClass } from "@/detectionClasses";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DetectionClassIcon } from "@/utils/DetectionClassIcon";
import { useEventStore } from "@/utils/store";
import { getLabelText } from "@/utils/utils";
import { DiameterIcon } from "lucide-react";

export function ClassSelector() {
  const detectionClasses = useEventStore((state) => state.detectionClasses);
  const setDetectionClasses = useEventStore(
    (state) => state.setDetectionClasses
  );
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  const toggleOption = (option: DetectionClass) => {
    setDetectionClasses(
      detectionClasses.includes(option)
        ? detectionClasses.filter((o) => o !== option)
        : [...detectionClasses, option]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {!open ? (
          <DiameterIcon />
        ) : (
          <Button
            variant={"outline"}
            className={cn("w-[100%] justify-start text-left font-normal ")}
          >
            <DiameterIcon />
            {detectionClasses.length} selected
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "bottom" : "right"}
        className="w-auto p-0"
        align="start"
      >
        <Command>
          <CommandList
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <CommandItem
              onSelect={() =>
                setDetectionClasses(
                  Object.values(DetectionClass).filter(
                    (detClass) => detClass !== DetectionClass.Motion
                  )
                )
              }
            >
              Reset
            </CommandItem>
            <CommandSeparator />
            {Object.values(DetectionClass).map((detClass) => (
              <CommandItem
                key={detClass}
                onSelect={() => toggleOption(detClass)}
              >
                <DetectionClassIcon detectionClass={detClass} />
                <input
                  type="checkbox"
                  checked={detectionClasses.includes(detClass)}
                  readOnly
                  className="mr-2"
                />
                {getLabelText(detClass)}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
