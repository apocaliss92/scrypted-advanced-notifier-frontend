import { Card } from "@/components/ui/card";
import { DetectionClassIcon } from "@/utils/DetectionClassIcon";
import { useEventStore } from "@/utils/store";
import { VideoClip } from "@/utils/types";
import { formatTimestamp, getRelevantClass } from "@/utils/utils";
import { VideoclipDialogImage } from "./VideoclipDialogImage";

type Props = {
  videoclip: VideoClip;
};

export default function VideoclipElement({ videoclip }: Props) {
  const timezone = useEventStore((state) => state.timezone);

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
              detectionClass={getRelevantClass(
                videoclip.detectionClasses ?? ["motion"]
              )}
            />
          </div>
          <div className="absolute top-0 right-0 w-6 h-6 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center rounded cursor-pointer transition-colors duration-200">
            <div className="text-[10px] text-gray-300 hover:text-white font-semibold">
              {videoclip.duration && `${Math.ceil(videoclip.duration / 1000)}s`}
            </div>
          </div>
          <VideoclipDialogImage videoclip={videoclip} />
        </div>
      </Card>
      <div className="text-xs font-semibold text-gray-700">
        {formatTimestamp(videoclip.startTime, timezone)}
      </div>
      <div className="text-xs text-gray-500">{videoclip.deviceName}</div>
    </>
  );
}
