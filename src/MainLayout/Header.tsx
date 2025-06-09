import { useEventStore } from "@/utils/store";
import { UserSelector } from "./components/UserSelector";
import { ToolSwitcher } from "./components/ToolSwitcher";

export default function Header() {
  const userInfo = useEventStore((state) => state.userInfo);

  return (
    <header className="w-full h-[5vh] md:h-[10vh] px-4 flex items-center justify-between border-b border-gray-200 bg-white gap-10">
      <div className="text-base sm:text-lg font-semibold">
        Advanced Notifier
      </div>
      <ToolSwitcher />
      <div className="flex-1" />
      <div className="flex items-center space-x-4">
        <UserSelector />
      </div>
    </header>
  );
}
