import { Card } from "@/components/ui/card";
import { useFilterEvents } from "@/hooks/use-filter-events";
import { useApi } from "@/utils/api";
import { DetectionClassIcon } from "@/utils/DetectionClassIcon";
import { useEventStore } from "@/utils/store";
import { DetectionEvent, Page } from "@/utils/types";
import {
  formatTimestamp,
  getClassBadgeColor,
  getEventRelevantClass,
  getLabelText,
} from "@/utils/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { endOfDay, startOfDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { EventDialogImage } from "./EventDialogImage";
import { SourceIcon } from "@/utils/SourceIcon";

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
  const timezone = useEventStore((state) => state.timezone);
  const setFilter = useEventStore((state) => state.setFilter);
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
            const event = events[index];
            if (!event) break;

            const relevantClass = getEventRelevantClass(event);

            items.push(
              <div
                key={event.id}
                style={{
                  flex: `0 0 ${100 / columnCount}%`,
                  maxWidth: `${100 / columnCount}%`,
                  padding: "0.5rem",
                }}
              >
                <Card
                  className="rounded-none cursor-pointer overflow-auto relative group w-full p-0"
                  style={{ aspectRatio: "1 / 1", width: "100%" }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-6 h-6 bg-black/50 text-white flex items-center justify-center rounded">
                      <DetectionClassIcon
                        small
                        detectionClass={getEventRelevantClass(event)}
                      />
                    </div>
                    <div className="absolute top-0 right-0 w-6 h-6 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center rounded cursor-pointer transition-colors duration-200">
                      <div className="text-[10px] text-gray-300 hover:text-white font-semibold">
                        <SourceIcon eventSource={event.source} />
                      </div>
                    </div>
                    <EventDialogImage event={event} />
                    {event.label && (
                      <div className="absolute bottom-1 left-1">
                        <div
                          className={`inline-flex items-center px-1 py-0.5 rounded-full text-[0.6rem] font-small ${getClassBadgeColor(
                            relevantClass
                          )}`}
                          onClick={() => event.label && setFilter(event.label)}
                        >
                          {getLabelText(event.label)}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
                <div className="text-xs font-semibold text-gray-700">
                  {formatTimestamp(event.timestamp, timezone)}
                </div>
                <div className="text-xs text-gray-500">{event.deviceName}</div>
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
