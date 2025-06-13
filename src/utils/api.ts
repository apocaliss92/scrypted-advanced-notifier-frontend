import { VideoClip as ScryptedClip, ScryptedInterface, VideoClips } from "@scrypted/types";
import axios from "axios";
import { useScryptedClientContext } from "./scryptedClient";
import { useEventStore } from "./store";
import { AppConfigs, CameraType, DetectionEvent, Page, ScryptedEventSource, VideoClip } from "./types";
import { EventRecorder } from "@scrypted/sdk";

export const useApi = () => {
    const setUserInfo = useEventStore((state) => state.setUserInfo);
    const setAuthError = useEventStore((state) => state.setAuthError);
    const setPage = useEventStore((state) => state.setPage);
    const client = useScryptedClientContext();

    const getEvents = async (startTime: number, endTime: number) => {
        const dataFetcher = client.systemManager.getDeviceByName<EventRecorder>('Advanced notifier data fetcher');
        const events = await dataFetcher.getRecordedEvents({ startTime, endTime });

        return events.map(event => event.data as DetectionEvent);
    };

    const getVideoclips = async (startTime: number, endTime: number) => {
        const dataFetcher = client.systemManager.getDeviceByName<VideoClips>('Advanced notifier data fetcher');
        const videoclips = await dataFetcher.getVideoClips({ startTime, endTime });

        return videoclips as VideoClip[];
    };

    const getConfigs = async (): Promise<AppConfigs> => {
        const cameras: CameraType[] = client ?
            Object.keys(client.systemManager.getSystemState())
                .map(deviceId => client.systemManager.getDeviceById<CameraType>(deviceId))
                .filter(device => [ScryptedInterface.VideoCamera, ScryptedInterface.Camera]
                    .some(int => device.interfaces.includes(int))) :
            [];
        const frigateDevice = client.systemManager.getDeviceByName('Frigate bridge');
        const enabledDetectionSources: ScryptedEventSource[] = [
            ScryptedEventSource.RawDetection,
            ScryptedEventSource.NVR
        ];
        if (frigateDevice) {
            enabledDetectionSources.push(ScryptedEventSource.Frigate);
        }

        return {
            cameras,
            enabledDetectionSources,
        };
    };

    const remoteLog = async (...content: string[]) => {
        const dataFetcher = client.systemManager.getDeviceByName<EventRecorder>('Advanced notifier data fetcher');
        const logger = client.deviceManager.getDeviceConsole(dataFetcher.nativeId);

        logger.log(...content);
    };

    const getEventImageUrls = (event: DetectionEvent) => {
        return {
            thumbnail: `${import.meta.env.VITE_ASSETS_BASE_URL}${event.thumbnailUrl}`,
            fullRes: `${import.meta.env.VITE_ASSETS_BASE_URL}${event.imageUrl}`,
        };
    };

    const getVideoclipUrls = (clip: VideoClip) => {
        const srcThumbnailUrl = clip.resources?.thumbnail?.href;
        const isLocal = import.meta.env.DEV;
        const thumbnailUrl = isLocal && !srcThumbnailUrl?.startsWith('http') ?
            `/api${srcThumbnailUrl}` : srcThumbnailUrl;

        let videoUrl = `${import.meta.env.VITE_ASSETS_BASE_URL}${clip.videoclipHref}`;
        let supportsH265 = false;
        try {
            supportsH265 = MediaSource.isTypeSupported('video/mp4; codecs="hvc1.1.6.L93.B0"');

        } catch {
            const video = document.createElement('video');
            const canPlay = video.canPlayType('video/mp4; codecs="hvc1.1.6.L93.B0"');
            if (canPlay === 'probably' || canPlay === 'maybe') {
                supportsH265 = true;
            }
        }
        videoUrl += `?h265=${supportsH265}`;

        return {
            thumbnailUrl,
            videoUrl,
        };
    };

    const getVideoclipImage = (clip: ScryptedClip) => {
        const srcThumbnailUrl = clip.resources?.thumbnail?.href;
        const isLocal = import.meta.env.DEV;
        const thumbnailUrl = isLocal && !srcThumbnailUrl?.startsWith('http') ?
            `/api${srcThumbnailUrl}` : srcThumbnailUrl;

        return thumbnailUrl;
    };

    const login = async (username: string, password: string) => {
        const response = await axios.post<any>(
            import.meta.env.VITE_API_LOGIN_URL,
            {
                username,
                password,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            },
        );

        if (response.data?.error) {
            setUserInfo(undefined);
            setAuthError(response.data.error);
        } else {
            const token = btoa(`${username}:${password}`);
            const basicAuthToken = `Basic ${token}`;

            setAuthError(undefined);
            setUserInfo({
                ...response.data,
                basicAuthToken,
            });
            setPage(Page.Events);
        }
    };

    const logout = () => {
        document.cookie = "login_user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setUserInfo(undefined);
        setPage(Page.Login);
    };

    return {
        login,
        logout,
        getConfigs,
        getEventImageUrls,
        getEvents,
        getVideoclips,
        getVideoclipUrls,
        remoteLog,
        getVideoclipImage,
    };
}