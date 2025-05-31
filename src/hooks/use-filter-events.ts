import { DetectionClass, detectionClassesDefaultMap } from "@/detectionClasses";
import { useEventStore } from "@/utils/store";
import { DetectionEvent, ScryptedEventSource } from "@/utils/types";

export const useFilterEvents = (events: DetectionEvent[]) => {
    const cameras = useEventStore((state) => state.cameras);
    const detectionClasses = useEventStore((state) => state.detectionClasses);
    const eventSource = useEventStore((state) => state.eventSource);
    const filter = useEventStore((state) => state.filter);

    return events.filter((event) => {
        const isClassUniqueOnSource = [
            DetectionClass.Doorbell,
            DetectionClass.Sensor,
            DetectionClass.Package,
            DetectionClass.Audio,
        ].some(elem => event.classes.includes(elem));

        const isSourceOk = eventSource === ScryptedEventSource.Auto ?
            (isClassUniqueOnSource || event.source === ScryptedEventSource.NVR) :
            event.source === eventSource;

        return (
            isSourceOk &&
            event.classes.some(
                (detClass) =>
                    detectionClasses.includes(detClass as DetectionClass) ||
                    detectionClasses.includes(detectionClassesDefaultMap[detClass])
            ) &&
            (cameras.length ? cameras.includes(event.deviceName) : true) &&
            // TODO: Use a fuzzy filter
            (filter ? event.label && event.label?.includes(filter) : true)
        );
    });
}