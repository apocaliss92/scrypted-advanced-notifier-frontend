import { useApi } from "@/utils/api";
import { useScryptedClientContext } from "@/utils/scryptedClient";
import { CameraType } from "@/utils/types";
import { VideoClip } from "@scrypted/types";
import { format, startOfDay } from "date-fns";
import { orderBy } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  device: CameraType;
}

export default function Videoclips({ device }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const client = useScryptedClientContext();
  const { getVideoclipImage } = useApi();

  const [clips, setClips] = useState<VideoClip[]>([]);

  const fetchClips = useCallback(async () => {
    const startTime = startOfDay(new Date()).getTime();
    const endTime = new Date().getTime();
    const videoclips = await device.getVideoClips({
      startTime,
      endTime,
    });

    setClips(orderBy(videoclips, (clip) => clip.startTime, ["desc"]));
  }, []);

  useEffect(() => {
    if (client) {
      fetchClips().catch(console.log);
    }
  }, [videoRef, device, client]);

  return (
    <div className="flex flex-col overflow-auto h-full w-full space-y-2">
      {clips.map((clip) => {
        const thumbnailUrl = getVideoclipImage(clip);
        return (
          <div
            key={clip.id}
            className="flex w-full bg-white shadow-sm items-center p-2"
          >
            <div className="flex flex-col justify-center text-left">
              <h3 className="text-sm font-semibold text-gray-800">
                {clip.detectionClasses.join(", ")}
              </h3>
              <p className="text-xs text-gray-500">
                {format(clip.startTime, "HH:mm")}
              </p>
            </div>

            <div className="flex-1" />

            <div className="w-auto h-[100px] lg-h-[2000px]">
              <img src={thumbnailUrl} className="w-auto h-full rounded-md" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
