import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/utils/store";
import { Page } from "@/utils/types";
import { GalleryThumbnails, TvIcon, Video } from "lucide-react";

interface Tool {
  name: string;
  logo: React.ElementType;
  page: Page;
}

const tools: Tool[] = [
  {
    name: "Events",
    logo: GalleryThumbnails,
    page: Page.Events,
  },
  {
    name: "Videoclips",
    logo: Video,
    page: Page.Videoclips,
  },
  {
    name: "Live",
    logo: TvIcon,
    page: Page.Live,
  },
];

export function ToolSwitcher() {
  const page = useEventStore((state) => state.page);
  const setPage = useEventStore((state) => state.setPage);
  const activeTool = tools.find((tool) => tool.page === page);
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors">
          {" "}
          <activeTool.logo />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "top" : "right"}
        className="w-auto p-0"
        align="start"
      >
        <Command>
          <CommandList
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {tools.map((tool) => (
              <CommandItem key={tool.name} onSelect={() => setPage(tool.page)}>
                <button
                  className={cn(
                    "w-8 h-8 rounded-full text-black flex items-center justify-center hover:bg-neutral-800 transition-colors",
                    tool.page === page && "bg-black text-white"
                  )}
                >
                  <tool.logo />
                </button>
                {tool.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
