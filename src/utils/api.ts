import { VideoClip as ScryptedClip } from "@scrypted/types";
import axios from "axios";
import { useScryptedClientContext } from "./scryptedClient";
import { useEventStore } from "./store";
import { AppConfigs, DetectionEvent, Page, VideoClip } from "./types";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

enum ApiMethod {
    GetEvents = 'GetEvents',
    GetVideoclips = 'GetVideoclips',
    GetVideoclipHref = 'GetVideoclipHref',
    GetConfigs = 'GetConfigs',
    RemoteLog = 'RemoteLog',
}

export const useApi = () => {
    const userInfo = useEventStore((state) => state.userInfo);
    const setUserInfo = useEventStore((state) => state.setUserInfo);
    const setAuthError = useEventStore((state) => state.setAuthError);
    const setPage = useEventStore((state) => state.setPage);
    const client = useScryptedClientContext();

    const baseCall = async <T>(props: {
        apimethod: ApiMethod,
        method?: 'GET' | 'POST',
        payload?: any,
    }) => {
        const { apimethod, method = 'GET', payload } = props;
        const res = await axios.request({
            method,
            url: `${baseUrl}/eventsApp`,
            data: {
                apimethod,
                payload,
            },
            headers: {
                Authorization: userInfo?.basicAuthToken
            }
        });

        return res.data as T;
    };

    const getEvents = async (fromDate: number, tillDate: number) => {
        return baseCall<DetectionEvent[]>({
            apimethod: ApiMethod.GetEvents,
            method: "POST",
            payload: {
                fromDate,
                tillDate,
            }
        });
    };

    const getVideoclips = async (fromDate: number, tillDate: number) => {
        return baseCall<VideoClip[]>({
            apimethod: ApiMethod.GetVideoclips,
            method: "POST",
            payload: {
                fromDate,
                tillDate,
            }
        });
    };

    const getConfigs = async () => {
        return baseCall<AppConfigs>({
            apimethod: ApiMethod.GetConfigs,
            method: "POST",
        });
    };

    const remoteLog = async (content: string) => {
        return baseCall<AppConfigs>({
            apimethod: ApiMethod.RemoteLog,
            method: "POST",
            payload: {
                content,
            }
        });
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