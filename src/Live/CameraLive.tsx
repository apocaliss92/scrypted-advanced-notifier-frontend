import { CameraType } from "@/hooks/use-get-cameras";
import { useScryptedClientContext } from "@/utils/scryptedClient";
import { BrowserSignalingSession } from "@scrypted/common/src/rtc-signaling";
import { RTCSessionControl } from "@scrypted/sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import Videoclips from "./Videoclips";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { RTCSignalingChannel, ScryptedMimeTypes } from "@scrypted/types";

interface Props {
  device: CameraType;
}

export default function CameraLive({ device }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const client = useScryptedClientContext();

  const pc = useRef<Promise<RTCPeerConnection>>(null);
  const session = useRef<BrowserSignalingSession>(null);
  const control = useRef<RTCSessionControl>(null);

  const [playing, setPlaying] = useState(false);
  // const [muted, setMuted] = useState(true);
  const [micActive, setMicActive] = useState(true);

  const isMobile = useIsMobile();

  // const toggleFullscreen = () => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   if (document.fullscreenElement) {
  //     document.exitFullscreen().catch(console.error);
  //   } else if (video.requestFullscreen) {
  //     video.requestFullscreen().catch(console.error);
  //   } else if ((video as any).webkitEnterFullscreen) {
  //     (video as any).webkitEnterFullscreen();
  //   }
  // };

  // const togglePiP = async () => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   try {
  //     if (document.pictureInPictureElement) {
  //       await document.exitPictureInPicture();
  //     } else if (video.requestPictureInPicture) {
  //       await video.requestPictureInPicture();
  //     }
  //   } catch (err) {
  //     console.error("PiP error:", err);
  //   }
  // };

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

  // const toggleMuted = async () => {
  //   const active = !muted;

  //   setMuted(active);
  // };

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

    // const mo = await device.getVideoStream({
    //   destination: 'local',
    //   video: {
    //     codec: "h264",
    //   },
    // });
    // const channel = await client.mediaManager.convertMediaObject<RTCSignalingChannel>(
    //   mo,
    //   ScryptedMimeTypes.RTCSignalingChannel
    // );
    // const newControl = (await channel.startRTCSignalingSession(newSession))!;

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
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4 h-[90vh]">
        <div className="lg:col-span-3 xl:col-span-4">
          {/* <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg"> */}
          <TransformWrapper>
            <TransformComponent>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                controls
                // muted={muted}
                className="w-full md:w-auto max-h-auto md:max-h-[calc(90vh-30px)]"
              />
            </TransformComponent>
          </TransformWrapper>
          <div
            className="flex items-center justify-between 
            bg-black/70 text-white px-4 py-2 
            h-[30px]
            "
          >
            {device.name}
          </div>
          {/* <div
              className="flex items-center justify-between 
            bg-black/70 text-white px-4 py-2 
            max-w-[1500px] max-h-[70vh] w-full
            "
            >
              {device.name}
            </div> */}
          {/* </AspectRatio> */}

          {/* <div className="flex items-center justify-between bg-black/70 text-white px-4 py-2 max-w-[1500px] max-h-[80vh] w-full">
            <button onClick={togglePlayPause} className="hover:text-gray-300">
              {playing ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
            </button>
            <button onClick={toggleMuted} className="hover:text-gray-300">
              {muted ? <VolumeXIcon size={24} /> : <Volume2Icon size={24} />}
            </button>
            <button onClick={togglePiP} className="hover:text-gray-300">
              <PictureInPicture size={24} />
            </button>
            <button onClick={toggleFullscreen} className="hover:text-gray-300">
              <MaximizeIcon size={24} />
            </button>
          </div> */}
        </div>
        <div className="flex-1 overflow-auto">
          {/* <div className="flex flex-col h-[45vh] lg:h-[90vh] overflow-auto"> */}
          <Videoclips device={device} />
        </div>
        {/* <div className="grid grid-cols-1 gap-4">
          <Videoclips device={device} />
        </div> */}
        {!isMobile && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">Eventi 2</div>
        )}
      </div>
    </div>
  );
}
