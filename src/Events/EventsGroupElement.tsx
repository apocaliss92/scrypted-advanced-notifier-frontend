import { Card } from "@/components/ui/card";
import { DetectionGroup } from "@/hooks/use-filter-events";
import { DetectionClassIcon } from "@/utils/DetectionClassIcon";
import { SourceIcon } from "@/utils/SourceIcon";
import { useEventStore } from "@/utils/store";
import {
  formatTimestamp,
  getClassBadgeColor,
  getRelevantClass,
  getLabelText,
} from "@/utils/utils";
import { EventDialogImage } from "./EventDialogImage";

type Props = {
  eventsGroup: DetectionGroup;
};

export default function EventsGroupElement({ eventsGroup }: Props) {
  const timezone = useEventStore((state) => state.timezone);
  const setFilter = useEventStore((state) => state.setFilter);

  const event = eventsGroup.representative;
  const relevantClass = getRelevantClass(event.classes);

  return (
    <>
      <Card
        className="rounded-none cursor-pointer overflow-auto relative group w-full p-0"
        style={{ aspectRatio: "1 / 1", width: "100%" }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="absolute top-0 left-0 w-6 h-6 bg-black/50 text-white flex items-center justify-center rounded">
            <DetectionClassIcon
              small
              detectionClass={getRelevantClass(event.classes)}
            />
          </div>
          <div className="absolute top-0 right-0 w-6 h-6 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center rounded cursor-pointer transition-colors duration-200">
            <div className="text-[10px] text-gray-300 hover:text-white font-semibold">
              {eventsGroup.events.length > 1 ? (
                `+${eventsGroup.events.length}`
              ) : (
                <SourceIcon eventSource={event.source} />
              )}
            </div>
          </div>
          <EventDialogImage eventsGroup={eventsGroup} />
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
    </>
  );
}
