import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DetectionGroup } from "@/hooks/use-filter-events";
import { cn } from "@/lib/utils";
import { useApi } from "@/utils/api";
import { getLabelText } from "@/utils/utils";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Circle,
  CircleDot,
} from "lucide-react";
import { useState } from "react";

export function EventDialogImage({
  eventsGroup,
}: {
  eventsGroup: DetectionGroup;
}) {
  const [open, setOpen] = useState(false);
  const { getEventImageUrls } = useApi();
  const event = eventsGroup.representative;
  const { thumbnail } = getEventImageUrls(event);
  const [loaded, setLoaded] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(
    eventsGroup.events.findIndex((elem) => elem.id === event.id)
  );
  const [currentEvent, setCurrentEvent] = useState(event);

  const showCarousel = eventsGroup.events.length > 1;
  const { fullRes } = getEventImageUrls(currentEvent);

  const selectImage = (index: number) => {
    setCurrentIndex(index);
    setCurrentEvent(eventsGroup.events[index]);
  };

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % eventsGroup.events.length;
    selectImage(newIndex);
    setLoaded(false);
  };
  const previousImage = () => {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = eventsGroup.events.length - 1;
    }
    selectImage(newIndex);
    setLoaded(false);
  };

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
        <DialogTitle className="sr-only">Full res image</DialogTitle>
        <DialogDescription className="sr-only">
          Full res image
        </DialogDescription>
        {!loaded && <Skeleton className="w-full h-[50vh] rounded-md" />}
        <img
          src={fullRes}
          alt="full"
          className={cn(
            "max-w-full max-h-[80vh] object-contain mx-auto my-auto",
            !loaded ? "hidden" : ""
          )}
          onLoad={() => setLoaded(true)}
        />

        {showCarousel && (
          <div className="absolute left-1/2 top-5 -translate-x-1/2 flex items-center justify-center rounded cursor-pointer transition-colors duration-200">
            {eventsGroup.events.map((_, i) =>
              i === currentIndex ? (
                <CircleDot key={i} className="text-primary w-10 h-10" />
              ) : (
                <Circle
                  key={i}
                  className="text-muted-foreground w-10 h-10 opacity-40"
                  onClick={() => selectImage(i)}
                />
              )
            )}
          </div>
        )}

        {showCarousel && (
          <div className="absolute top-[50%] left-5 w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-colors duration-200">
            <div className="text-[10px] text-gray-300 hover:text-black font-semibold">
              <ArrowLeftCircle size={50} onClick={previousImage} />
            </div>
          </div>
        )}

        {showCarousel && (
          <div className="absolute top-[50%] right-5 w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-colors duration-200">
            <div className="text-[10px] text-gray-300 hover:text-black font-semibold">
              <ArrowRightCircle size={50} onClick={nextImage} />
            </div>
          </div>
        )}

        <div className="w-full p-4 border-t border-none bg-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          {currentEvent.sensorName && (
            <div className="flex gap-2">{currentEvent.sensorName ?? " "}</div>
          )}
          <div className="flex gap-2">
            <span className="text-muted-foreground">
              {currentEvent.classes
                .map((detClass) => getLabelText(detClass))
                .join(", ")}
              {currentEvent.label ? ` (${currentEvent.label})` : ""}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground">
              Source: {currentEvent.source}
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
