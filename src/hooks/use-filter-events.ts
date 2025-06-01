import { DetectionClass, detectionClassesDefaultMap } from "@/detectionClasses";
import { useEventStore } from "@/utils/store";
import { DetectionEvent, ScryptedEventSource } from "@/utils/types";
import { identity, uniq } from "lodash";
import { useMemo } from "react";

const SOURCE_PRIORITY: Record<ScryptedEventSource, number> = {
    [ScryptedEventSource.NVR]: 1,
    [ScryptedEventSource.Frigate]: 2,
    [ScryptedEventSource.RawDetection]: 3,
    [ScryptedEventSource.Auto]: 99,
};

export interface DetectionGroup {
    events: DetectionEvent[];
    representative: DetectionEvent;
    classes: string[];
    labels: string[];
};

export const useFilterEvents = (events: DetectionEvent[]) => {
    const cameras = useEventStore((state) => state.cameras);
    const detectionClasses = useEventStore((state) => state.detectionClasses);
    const eventSource = useEventStore((state) => state.eventSource);
    const filter = useEventStore((state) => state.filter);
    const groupingRange = useEventStore((state) => state.groupingRange);
    const isOnlyMotion = detectionClasses.length === 1 && detectionClasses[0] === DetectionClass.Motion;

    const timeThreshold = groupingRange * 1000;

    return useMemo(() => {
        const sortedEvents = events
            .filter(event => {
                const isSourceOk = eventSource === ScryptedEventSource.Auto ?
                    true :
                    event.source === eventSource;

                const isClassOk = isOnlyMotion ?
                    event.classes.length === 1 && event.classes[0] === DetectionClass.Motion :
                    event.classes.some(
                        (detClass) =>
                            detectionClasses.includes(detClass as DetectionClass) ||
                            detectionClasses.includes(detectionClassesDefaultMap[detClass])
                    )

                return (
                    isSourceOk &&
                    isClassOk &&
                    (cameras.length ? cameras.includes(event.deviceName) : true) &&
                    // TODO: Use a fuzzy filter
                    (filter ? event.label && event.label.toLowerCase()?.includes(filter.toLowerCase()) : true)
                );
            })
            .map(event => {
                let classes = event.classes
                    .filter(cl => cl !== 'any_object');

                if (classes.length > 1) {
                    classes = classes.filter(cl => cl !== 'motion');
                }

                return {
                    ...event,
                    classes,
                }
            })
            .sort((a, b) => b?.timestamp - a?.timestamp);

        if (eventSource === ScryptedEventSource.Auto) {
            const groups: DetectionGroup[] = [];
            const assigned = new Set<string>(); // event.id

            for (const event of sortedEvents) {
                if (assigned.has(event.id)) continue;

                const groupEvents = [event];
                assigned.add(event.id);
                const groupClasses = new Set(event.classes);

                for (const other of sortedEvents) {
                    if (assigned.has(other.id) || other.deviceName !== event.deviceName) continue;
                    const timeDiff = Math.abs(other.timestamp - event.timestamp);
                    if (timeDiff > timeThreshold) continue;

                    // Check if they share any mapped class
                    const shared = other.classes.some(c => groupClasses.has(
                        detectionClassesDefaultMap[c]) ||
                        groupClasses.has(c)
                    );

                    if (shared) {
                        groupEvents.push(other);
                        assigned.add(other.id);
                        other.classes.forEach(c => groupClasses.add(c));
                    }
                }

                const representative = groupEvents.reduce((best, cur) => {
                    const p1 = SOURCE_PRIORITY[best.source] ?? 99;
                    const p2 = SOURCE_PRIORITY[cur.source] ?? 99;

                    if (p2 < p1) return cur;
                    if (p2 > p1) return best;

                    const hasLabel1 = !!best.label;
                    const hasLabel2 = !!cur.label;

                    if (hasLabel2 && !hasLabel1) return cur;
                    if (hasLabel1 && !hasLabel2) return best;

                    return best;
                });

                const classes = uniq(groupEvents.flatMap(event => event.classes));

                groups.push({
                    events: groupEvents,
                    representative,
                    classes,
                    labels: uniq(groupEvents.map(event => event.label!).filter(identity))
                });
            }


            return groups;
        } else {
            return sortedEvents.map(event => ({
                events: [event],
                representative: event,
                classes: event.classes,
                labels: [event.label]
            })) as DetectionGroup[];
        }
    }, [events, cameras, eventSource, filter, groupingRange, detectionClasses])
}