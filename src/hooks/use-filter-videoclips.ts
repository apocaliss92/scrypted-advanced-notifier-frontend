import { DetectionClass, detectionClassesDefaultMap } from "@/detectionClasses";
import { useEventStore } from "@/utils/store";
import { VideoClip } from "@/utils/types";
import { useMemo } from "react";

export const useFilterVideoclips = (videoclips: VideoClip[]) => {
    const cameras = useEventStore((state) => state.cameras);
    const detectionClasses = useEventStore((state) => state.detectionClasses);
    const isOnlyMotion = detectionClasses.length === 1 && detectionClasses[0] === DetectionClass.Motion;

    return useMemo(() => {
        return videoclips
            .filter(videoclip => {
                const isClassOk = isOnlyMotion ?
                    videoclip.detectionClasses?.length === 1 && videoclip.detectionClasses[0] === DetectionClass.Motion :
                    videoclip.detectionClasses?.some(
                        (detClass) =>
                            detectionClasses.includes(detClass as DetectionClass) ||
                            detectionClasses.includes(detectionClassesDefaultMap[detClass])
                    )

                return (
                    isClassOk &&
                    (cameras.length ? cameras.includes(videoclip.deviceName) : true)
                );
            })
            .sort((a, b) => b?.startTime - a?.startTime);
    }, [videoclips, cameras, detectionClasses])
}