import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/utils/store";
import { format } from "date-fns";
import { Calendar1Icon } from "lucide-react";

export function DateSelector() {
  const numericDate = useEventStore((state) => state.date);
  const setDate = useEventStore((state) => state.setDate);
  const date = numericDate ? new Date(numericDate) : undefined;
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {!open ? (
          <Calendar1Icon />
        ) : (
          <Button
            variant={"outline"}
            className={cn("w-[100%] justify-start text-left font-normal ")}
          >
            <Calendar1Icon />
            {date ? format(date, "MMM d") : <span>Pick a date</span>}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "bottom" : "right"}
        className="w-auto p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate?.getTime())}
        />
      </PopoverContent>
    </Popover>
  );
}
