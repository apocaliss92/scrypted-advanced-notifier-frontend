import { DetectionClass } from "@/detectionClasses";

export enum Page {
    Events = 'Events',
    Videoclips = 'Videoclips',
    Login = 'Login',
}

export enum AnimalClass {
    Dog = 'dog',
    Cat = 'cat',
    Horse = 'horse',
    Bird = 'bird',
}

export enum ScryptedEventSource {
    Auto = 'Auto',
    RawDetection = 'RawDetection',
    NVR = 'NVR',
    Frigate = 'Frigate'
}

export interface DetectionEvent {
    id: string;
    timestamp: number;
    classes: string[];
    label?: string;
    thumbnailUrl: string;
    imageUrl: string;
    videoUrl?: string;
    source: ScryptedEventSource;
    deviceName: string;
    sensorName?: string;
}
interface Resource {
    file?: string;
    href?: string;
}
interface VideoResource {
    thumbnail?: Resource;
    video?: Resource;
}
export interface VideoClip {
    id: string;
    deviceName: string;
    deviceId: string;
    videoclipHref: string;
    thumbnailUrl: string;
    startTime: number;
    duration?: number;
    event?: string;
    description?: string;
    detectionClasses?: string[];
    thumbnailId?: string;
    videoId?: string;
    resources?: VideoResource;
    source: ScryptedEventSource;
}
export enum Timezone {
    IT = 'it',
    EN_US = 'enUS'
}

export interface AppConfigs {
    cameras: {
        id: string,
        name: string,
    }[],
    enabledDetectionSources: ScryptedEventSource[],
    eventDays: string[],
    nvrUrl: string,
}

export interface UserInfo {
    authorization: string;
    queryToken: {
        scryptedToken: string;
    },
    expiration: number,
    username: string,
    token: string,
    basicAuthToken: string,
    hostname: string,
    externalAddresses: string[],
    addresses: string[],
}

export type EventStore = {
    sidebarOpen?: boolean
    setSidebarOpen: (sidebarOpen?: boolean) => void

    userInfo?: UserInfo
    setUserInfo: (userInfo?: UserInfo) => void

    authError?: string
    setAuthError: (authError?: string) => void

    timezone: Timezone
    setTimezone: (timezone: Timezone) => void

    page: Page
    setPage: (page: Page) => void

    detectionClasses: DetectionClass[]
    setDetectionClasses: (detectionClasses: DetectionClass[]) => void

    cameras: string[]
    setCameras: (cameras: string[]) => void

    eventSource: ScryptedEventSource
    setEventSource: (eventSource: ScryptedEventSource) => void

    filter: string
    setFilter: (filter: string) => void

    date?: number
    setDate: (date?: number) => void

    configs?: AppConfigs
    setConfigs: (configs: AppConfigs) => void

    groupingRange: number
    setGroupingRange: (groupingRange: number) => void

    refreshTime: number
    setRefreshTime: (refreshTime: number) => void
}