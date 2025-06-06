import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/utils/store";
import { Group } from "lucide-react";
import { useState } from "react";

export function GroupTimeRange() {
  const groupingRange = useEventStore((state) => state.groupingRange);
  const setGroupingRange = useEventStore((state) => state.setGroupingRange);
  const [tmpValue, setTmpValue] = useState(groupingRange);
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Group className="w-[100%]" />
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "top" : "right"}
        className="w-auto p-4"
        align="start"
      >
        <Label>Grouping seconds</Label>
        <Slider
          min={1}
          max={30}
          step={1}
          value={[tmpValue]}
          className={cn("w-[150px] flex flex-col space-y-4")}
          onValueChange={([val]) => setTmpValue(val)}
          onValueCommit={([val]) => setGroupingRange(val)}
        />
        <div className="text-sm text-muted-foreground text-right">
          {tmpValue}
        </div>
      </PopoverContent>
    </Popover>
  );
}
