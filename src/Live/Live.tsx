import { useEventStore } from "@/utils/store";
import CameraLive from "./CameraLive";
import CameraPreview from "./CameraPreview";

export default function Live() {
  const configs = useEventStore((state) => state.configs);
  const { cameras } = configs;

  const selectedCameraId = useEventStore((state) => state.selectedCamera);
  const selectedCamera = selectedCameraId
    ? cameras.find((camera) => camera.id === selectedCameraId)
    : undefined;

  return selectedCamera ? (
    <CameraLive device={selectedCamera} />
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {cameras.map((device) => (
        <CameraPreview key={device.id} device={device} />
      ))}
    </div>
  );
}
