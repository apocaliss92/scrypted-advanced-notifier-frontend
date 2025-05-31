import axios from "axios"
import { AppConfigs, DetectionEvent, Page } from "./types";
import { useEventStore } from "./store";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

enum ApiMethod {
    GetEvents = 'GetEvents',
    GetConfigs = 'GetConfigs',
}

export const useApi = () => {
    const userInfo = useEventStore((state) => state.userInfo);
    const setUserInfo = useEventStore((state) => state.setUserInfo);
    const setAuthError = useEventStore((state) => state.setAuthError);
    const setPage = useEventStore((state) => state.setPage);

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

    const getConfigs = async () => {
        return baseCall<AppConfigs>({
            apimethod: ApiMethod.GetConfigs,
            method: "POST",
        });
    };

    const getEventImageUrls = (event: DetectionEvent) => {
        return {
            thumbnail: `${import.meta.env.VITE_API_IMAGES_URL}${event.thumbnailUrl}`,
            fullRes: `${import.meta.env.VITE_API_IMAGES_URL}${event.imageUrl}`,
        };
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
            })
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
        getEvents
    };
}