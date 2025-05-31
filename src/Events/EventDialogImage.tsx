import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useApi } from "@/utils/api";
import { DetectionEvent } from "@/utils/types";
import { getLabelText } from "@/utils/utils";
import { useState } from "react";

export function EventDialogImage({ event }: { event: DetectionEvent }) {
  const [open, setOpen] = useState(false);
  const { getEventImageUrls } = useApi();
  const { fullRes, thumbnail } = getEventImageUrls(event);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <img
          src={thumbnail}
          alt="preview"
          onClick={() => setOpen(true)}
          className="w-full h-full object-cover object-center cursor-pointer rounded shadow-sm"
        />
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 m-0 overflow-hidden">
        <img
          src={fullRes}
          alt="full"
          className="max-w-full max-h-[80vh] object-contain mx-auto my-auto"
        />

        <div className="w-full p-4 border-t border-none bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <span className="text-muted-foreground">
            {event.sensorName ?? " "}
          </span>
          <div className="flex gap-2">
            <span className="text-muted-foreground">
              {event.classes
                .map((detClass) => getLabelText(detClass))
                .join(", ")}
              {event.label ? ` (${event.label})` : ""}
            </span>
          </div>
          {/* <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              // onClick={() => navigator.clipboard.writeText(src)}
            >
              Go to NVR
            </button>
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              // onClick={() => window.open(src, "_blank")}
            >
              Apri
            </button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
