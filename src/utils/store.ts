import { DetectionClass } from '@/detectionClasses';
import { create, } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AppConfigs, EventStore, Page, ScryptedEventSource, Timezone, UserInfo } from './types';

const defaultDetectionClasses: DetectionClass[] = [
    DetectionClass.Animal,
    DetectionClass.Audio,
    DetectionClass.Doorbell,
    DetectionClass.Face,
    DetectionClass.Package,
    DetectionClass.Person,
    DetectionClass.Plate,
    DetectionClass.Vehicle,
];

export const useEventStore = create<EventStore>()(
    persist(
        (set) => ({
            userInfo: undefined,
            setUserInfo: (userInfo?: UserInfo) => set({ userInfo }),
            authError: undefined,
            setAuthError: (authError?: string) => set({ authError }),
            timezone: Timezone.IT,
            setTimezone: (timezone: Timezone) => set({ timezone }),
            eventSource: ScryptedEventSource.NVR,
            setEventSource: (eventSource: ScryptedEventSource) => set({ eventSource }),
            page: Page.Events,
            setPage: (page: Page) => set({ page }),
            detectionClasses: defaultDetectionClasses,
            setDetectionClasses: (detectionClasses: DetectionClass[]) => set({ detectionClasses }),
            filter: '',
            setFilter: (filter: string) => set({ filter }),
            date: new Date().getTime(),
            setDate: (date?: number) => set({ date }),
            config: undefined,
            setConfigs: (configs: AppConfigs) => set({ configs }),
            cameras: [],
            setCameras: (cameras: string[]) => set({ cameras }),
            refreshTime: new Date().getTime(),
            setRefreshTime: (refreshTime: number) => set({ refreshTime }),
            groupingRange: 5,
            setGroupingRange: (groupingRange?: number) => set({ groupingRange }),
        }),
        {
            name: 'events-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) => !['date'].includes(key)),
                ),
        },
    ),
);