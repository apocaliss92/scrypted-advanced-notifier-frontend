import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/utils/store";
import { Group } from "lucide-react";
import { useState } from "react";

export function GroupTimeRange() {
  const groupingRange = useEventStore((state) => state.groupingRange);
  const setGroupingRange = useEventStore((state) => state.setGroupingRange);
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  const [tmpValue, setTmpValue] = useState(groupingRange);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {!open ? (
          <Group />
        ) : (
          <Button
            variant={"outline"}
            className={cn("w-[100%] justify-start text-left font-normal ")}
          >
            <Group />
            {groupingRange} seconds
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "bottom" : "right"}
        className="w-auto p-0"
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
