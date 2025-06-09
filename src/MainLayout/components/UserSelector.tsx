import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Command,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApi } from "@/utils/api";
import { useEventStore } from "@/utils/store";
import { Page } from "@/utils/types";
import { Home, LogOut, User } from "lucide-react";

export function UserSelector() {
  const setPage = useEventStore((state) => state.setPage);
  const { logout } = useApi();
  const userInfo = useEventStore((state) => state.userInfo);
  const isMobile = useIsMobile();

  const onLogout = () => {
    logout();
    setPage(Page.Login);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar>
          <AvatarFallback>{userInfo.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
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
            <CommandItem>{userInfo.username}</CommandItem>
            <CommandSeparator />
            <CommandItem onSelect={onLogout}>
              <LogOut /> Logout
            </CommandItem>
            <CommandItem
              onSelect={() => window.location.replace(window.location.origin)}
            >
              <Home /> Back to Scrypted
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
