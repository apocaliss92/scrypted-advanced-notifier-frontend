import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { CameraType } from "@/hooks/use-get-cameras";
import { useScryptedClientContext } from "@/utils/scryptedClient";
import { useEventStore } from "@/utils/store";
import { BrowserSignalingSession } from "@scrypted/common/src/rtc-signaling";
import { RTCSessionControl } from "@scrypted/sdk";
import { ScryptedInterface } from "@scrypted/types";
import {
  ArrowBigLeftDash,
  FullscreenIcon,
  Volume2Icon,
  VolumeOff,
  MicOff,
  MicIcon,
  PlayCircle,
  PauseCircle,
  PauseIcon,
  PlayIcon,
  VolumeXIcon,
  MaximizeIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  device: CameraType;
}

export default function CameraLive({ device }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const client = useScryptedClientContext();
  const setSelectedCamera = useEventStore((state) => state.setSelectedCamera);

  const pc = useRef<Promise<RTCPeerConnection>>(null);
  const session = useRef<BrowserSignalingSession>(null);
  const control = useRef<RTCSessionControl>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [micActive, setMicActive] = useState(true);

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(console.error);
      } else {
        document.exitFullscreen().catch(console.error);
      }
    }
  };

  const toggleMicrophone = async () => {
    if (!control || !session) return;
    const active = !micActive;

    setMicActive(active);
    await control.current?.setPlayback({
      audio: active,
      video: true,
    });
    await session.current?.setMicrophone(active);
  };

  const togglePlayPause = async () => {
    const active = !playing;

    if (active) {
      await play();
      setPlaying(true);
    } else {
      cleanupPeerConnection();
      session.current?.close();
      control.current?.endSession();
      pc.current?.then((a) => a.close());
      setPlaying(false);
    }
  };

  const toggleMuted = async () => {
    const active = !muted;

    setMuted(active);
  };

  const cleanupPeerConnection = useCallback(() => {
    control.current?.endSession();
    session.current?.close();
    setPlaying(false);
    pc.current?.then((pc) => pc.close()).catch(() => {});

    session.current = null;
    control.current = null;
    pc.current = null;
  }, []);

  const play = async () => {
    if (!device || !videoRef.current || !client) {
      return;
    }

    cleanupPeerConnection();
    const newSession = new BrowserSignalingSession();
    const mediaStream = new MediaStream();

    newSession.onPeerConnection = async (pc) => {
      pc.ontrack = (e) => {
        console.log("add track", e.track);
        mediaStream.addTrack(e.track);
      };
    };

    const newControl: RTCSessionControl =
      (await device.startRTCSignalingSession(newSession))!;

    newSession.pcDeferred.promise.then((pc) => {
      pc.addEventListener("iceconnectionstatechange", () => {
        console.log("iceConnectionStateChange", pc.iceConnectionState);
        if (
          pc.iceConnectionState === "disconnected" ||
          pc.iceConnectionState === "failed" ||
          pc.iceConnectionState === "closed"
        ) {
          console.log("Session closed");
          newControl.endSession();
        }
      });
    });

    session.current = newSession;
    pc.current = newSession.pcDeferred.promise;
    control.current = newControl;

    videoRef.current.srcObject = mediaStream;
  };

  useEffect(() => {
    if (client) {
      togglePlayPause().then(() => toggleMicrophone().then());
    }
  }, [videoRef, device, client]);

  return (
    <div className="grid gap-4 p-0">
      <div className="p-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block cursor:pointer"></BreadcrumbItem>
            <BreadcrumbItem>
              <ArrowBigLeftDash
                width={30}
                height={30}
                onClick={() => setSelectedCamera(undefined)}
              />
              {device.name}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        <div className="xl:col-span-3 2xl:col-span-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className="max-w-[1500px] max-h-[80vh] w-full"
          />

          <div className="flex items-center justify-between bg-black/70 text-white px-4 py-2 max-w-[1500px] max-h-[80vh] w-full">
            <button onClick={togglePlayPause} className="hover:text-gray-300">
              {playing ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
            </button>
            <button onClick={toggleMuted} className="hover:text-gray-300">
              {muted ? <VolumeXIcon size={24} /> : <Volume2Icon size={24} />}
            </button>
            <button onClick={toggleFullscreen} className="hover:text-gray-300">
              <MaximizeIcon size={24} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">Eventi 1</div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">Eventi 2</div>
      </div>
    </div>
  );
}
