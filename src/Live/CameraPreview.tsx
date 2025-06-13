import { Card, CardContent } from "@/components/ui/card";
import { useScryptedClientContext } from "@/utils/scryptedClient";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEventStore } from "@/utils/store";
import { CameraType } from "@/utils/types";

interface Props {
  device: CameraType;
}

export default function CameraPreview({ device }: Props) {
  const client = useScryptedClientContext();
  const [b64Image, setB64Image] = useState<string>();
  const setSelectedCamera = useEventStore((state) => state.setSelectedCamera);

  const fetchImage = useCallback(async () => {
    if (client) {
      const mo = await device.takePicture({
        bulkRequest: true,
        reason: "periodic",
      });
      if (mo) {
        const bufferImage =
          await client.mediaManager.convertMediaObjectToBuffer(
            mo,
            "image/jpeg"
          );

        setB64Image(bufferImage?.toString("base64"));
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => await fetchImage(), 1000 * 10);
    fetchImage().then();

    return () => clearInterval(interval);
  }, [client, device]);

  return (
    <Card
      className="rounded-none cursor-pointer overflow-auto relative group w-full p-0"
      onClick={() => setSelectedCamera(device.id)}
    >
      <CardContent className="p-0 aspect-video">
        {b64Image ? (
          <img
            src={`data:image/jpeg;base64,${b64Image}`}
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <div className={`bg-black w-[100%] h-[100%]`} />
        )}
        {device.name && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-black/80 to-transparent px-3 py-1 text-white text-m font-semibold shadow-md">
            {device.name}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
