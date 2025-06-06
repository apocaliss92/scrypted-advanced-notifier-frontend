import { useScryptedClientContext } from "@/utils/scryptedClient";
import { DeviceBase, Camera, ScryptedInterface, VideoCamera, RTCSignalingChannel } from "@scrypted/types";
import { useMemo } from "react";

export type CameraType = DeviceBase & Camera & VideoCamera & RTCSignalingChannel;

export const useGetCameras = () => {
    const client = useScryptedClientContext();

    return useMemo(() => {
        const cameras: CameraType[] = client ?
            Object.keys(client.systemManager.getSystemState())
                .map(deviceId => client.systemManager.getDeviceById<CameraType>(deviceId))
                .filter(device => [ScryptedInterface.VideoCamera, ScryptedInterface.Camera]
                    .some(int => device.interfaces.includes(int))) :
            [];

        return { cameras };
    }, [client]);
}