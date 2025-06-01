import { useFilterEvents } from "@/hooks/use-filter-events";
import { useApi } from "@/utils/api";
import { useEventStore } from "@/utils/store";
import { DetectionEvent, Page } from "@/utils/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { endOfDay, startOfDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import EventsGroupElement from "./EventsGroupElement";

type Props = {
  columnWidth?: number;
  rowHeight?: number;
};

export default function EventsList({
  columnWidth = 120,
  rowHeight = 170,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const numericDate = useEventStore((state) => state.date);
  const refreshTime = useEventStore((state) => state.refreshTime);
  const setPage = useEventStore((state) => state.setPage);
  const [allEvents, setEvents] = useState<DetectionEvent[]>([]);

  const { getEvents } = useApi();

  useEffect(() => {
    const date = numericDate ? new Date(numericDate) : undefined;
    if (date) {
      getEvents(startOfDay(date).getTime(), endOfDay(date).getTime())
        .then((events) => {
          setEvents(events);
        })
        .catch((e) => {
          if (e.response.status === 401) {
            setPage(Page.Login);
          }
        });
    }
  }, [numericDate, refreshTime]);

  const events = useFilterEvents(allEvents);

  useEffect(() => {
    if (!parentRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(parentRef.current);
    return () => observer.disconnect();
  }, []);

  const columnCount = Math.max(1, Math.floor(containerWidth / columnWidth));
  const rowCount = Math.ceil(events.length / columnCount);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: `90vh`,
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((row) => {
          const items = [];
          const startIndex = row.index * columnCount;

          for (let i = 0; i < columnCount; i++) {
            const index = startIndex + i;
            const eventsGroup = events[index];
            const event = eventsGroup?.representative;

            if (!event) {
              continue;
            }

            items.push(
              <div
                key={event.id}
                style={{
                  flex: `0 0 ${100 / columnCount}%`,
                  maxWidth: `${100 / columnCount}%`,
                  padding: "0.5rem",
                }}
              >
                <EventsGroupElement eventsGroup={eventsGroup} />
              </div>
            );
          }

          return (
            <div
              key={row.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `translateY(${row.start}px)`,
                height: row.size,
                width: "100%",
                display: "flex",
              }}
            >
              {items}
            </div>
          );
        })}
      </div>
    </div>
  );
}
