import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventStore } from "@/utils/store";
import { Calendar1Icon } from "lucide-react";

export function DateSelector() {
  const numericDate = useEventStore((state) => state.date);
  const setDate = useEventStore((state) => state.setDate);
  const date = numericDate ? new Date(numericDate) : undefined;

  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Calendar1Icon className="w-[100%]" />
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "top" : "right"}
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
