import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useApi } from "@/utils/api";
import { VideoClip } from "@/utils/types";
import { getLabelText } from "@/utils/utils";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

export function VideoclipDialogImage({ videoclip }: { videoclip: VideoClip }) {
  const [open, setOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>();
  const { getVideoclipImageUrls, getVideoclipHref, getVideoclipVideoUrls } =
    useApi();
  const { thumbnailUrl } = getVideoclipImageUrls(videoclip);

  useEffect(() => {
    if (open) {
      let srcHref = videoclip.resources?.video?.href;
      if (!srcHref) {
        getVideoclipHref(videoclip).then((res) => {
          srcHref = res.videoHref;
          const { videoUrl } = getVideoclipVideoUrls(srcHref);
          setVideoUrl(videoUrl);
        });
      } else {
        const { videoUrl } = getVideoclipVideoUrls(srcHref);
        setVideoUrl(videoUrl);
      }
    }
  }, [videoUrl, videoclip, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <img
          src={thumbnailUrl}
          alt="preview"
          onClick={() => setOpen(true)}
          className="w-full h-full object-cover object-center cursor-pointer rounded shadow-sm"
        />
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 m-0 overflow-hidden">
        <DialogTitle className="sr-only">Full res image</DialogTitle>
        <DialogDescription className="sr-only">
          Full res image
        </DialogDescription>
        <video
          src={videoUrl}
          controls
          autoPlay
          className="max-w-full max-h-[80vh] object-contain mx-auto my-auto"
          // className="w-full h-auto bg-black"
          preload="metadata"
        />
        {/* <img
          src={fullRes}
          alt="full"
          className="max-w-full max-h-[80vh] object-contain mx-auto my-auto"
        /> */}

        <div className="w-full p-4 border-t border-none bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground">
              {(videoclip.detectionClasses ?? ["motion"])
                .map((detClass) => getLabelText(detClass))
                .join(", ")}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
