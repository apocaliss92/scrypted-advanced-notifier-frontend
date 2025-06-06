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
import { DetectionClass } from "@/detectionClasses";
import { useIsMobile } from "@/hooks/use-mobile";
import { DetectionClassIcon } from "@/utils/DetectionClassIcon";
import { useEventStore } from "@/utils/store";
import { getLabelText } from "@/utils/utils";
import { DiameterIcon } from "lucide-react";

export function ClassSelector() {
  const detectionClasses = useEventStore((state) => state.detectionClasses);
  const setDetectionClasses = useEventStore(
    (state) => state.setDetectionClasses
  );
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
        <DiameterIcon className="w-[100%]" />
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
