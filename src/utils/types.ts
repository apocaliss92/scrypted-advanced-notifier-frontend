import { DetectionClass } from "@/detectionClasses";
import { ScryptedClientLoginResult } from "@scrypted/client/src";
import { Camera, DeviceBase, RTCSignalingChannel, VideoClip as ScryptedVideoClip, VideoCamera, VideoClips } from "@scrypted/types";

export type CameraType = VideoClips & DeviceBase & Camera & VideoCamera & RTCSignalingChannel;

export enum Page {
    Events = 'Events',
    Videoclips = 'Videoclips',
    Live = 'Live',
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
    embedding?: string;
    thumbnailUrl: string;
    imageUrl: string;
    videoUrl?: string;
    source: ScryptedEventSource;
    deviceName: string;
    eventId: string;
    sensorName?: string;
}
export type VideoClip = ScryptedVideoClip & {
    deviceName: string,
    deviceId: string,
    videoclipHref: string,
}
export enum Timezone {
    IT = 'it',
    EN_US = 'enUS'
}

export interface AppConfigs {
    cameras: CameraType[],
    knownPeople: string[],
    enabledDetectionSources: ScryptedEventSource[]
}

export interface UserInfo extends ScryptedClientLoginResult {
    basicAuthToken?: string;
}

export type EventStore = {
    userInfo?: UserInfo,
    setUserInfo: (userInfo?: UserInfo) => void,

    authError?: string
    setAuthError: (authError?: string) => void

    timezone: Timezone
    setTimezone: (timezone: Timezone) => void

    page: Page
    setPage: (page: Page) => void

    detectionClasses: DetectionClass[]
    setDetectionClasses: (detectionClasses: DetectionClass[]) => void

    cameras: string[],
    setCameras: (cameras: string[]) => void,

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

    selectedCamera?: string
    setSelectedCamera: (selectedCamera?: string) => void
}