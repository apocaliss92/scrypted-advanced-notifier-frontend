import { useFilterVideoclips } from "@/hooks/use-filter-videoclips";
import { useApi } from "@/utils/api";
import { useEventStore } from "@/utils/store";
import { Page, VideoClip } from "@/utils/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { endOfDay, startOfDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import VideoclipElement from "./VideoclipElement";

type Props = {
  columnWidth?: number;
  rowHeight?: number;
};

export default function VideoclipsList({
  columnWidth = 120,
  rowHeight = 170,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const numericDate = useEventStore((state) => state.date);
  const refreshTime = useEventStore((state) => state.refreshTime);
  const setPage = useEventStore((state) => state.setPage);
  const [allVideoclips, setVideoclips] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(false);

  const { getVideoclips } = useApi();

  useEffect(() => {
    const date = numericDate ? new Date(numericDate) : undefined;
    if (date) {
      setLoading(true);
      getVideoclips(startOfDay(date).getTime(), endOfDay(date).getTime())
        .then((videoclips) => {
          setVideoclips(videoclips);
        })
        .catch((e) => {
          if (e.response.status === 401) {
            setPage(Page.Login);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [numericDate, refreshTime]);

  const videoclips = useFilterVideoclips(allVideoclips);

  useEffect(() => {
    if (!parentRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(parentRef.current);
    return () => observer.disconnect();
  }, []);

  const columnCount = Math.max(1, Math.floor(containerWidth / columnWidth));
  const rowCount = loading ? 20 : Math.ceil(videoclips.length / columnCount);

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
            const videoclip = videoclips[index];

            if (!videoclip) {
              continue;
            }

            items.push(
              <div
                key={videoclip.id}
                style={{
                  flex: `0 0 ${100 / columnCount}%`,
                  maxWidth: `${100 / columnCount}%`,
                  padding: "0.5rem",
                }}
              >
                <VideoclipElement videoclip={videoclip} loading={loading} />
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
