import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { DateSelector } from "@/Events/components/DateSelector";
import { ClassSelector } from "@/Events/components/ClassSelector";
import { SourceSelector } from "@/Events/components/SourceSelector";
import { CameraSelector } from "@/Events/components/CameraSelector";
import { LabelInput } from "@/Events/components/LabelInput";

export function NavFilters({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0 flex flex-col space-y-4">
        <SidebarGroupContent className="relative">
          <DateSelector />
        </SidebarGroupContent>

        <SidebarGroupContent className="relative">
          <ClassSelector />
        </SidebarGroupContent>

        <SidebarGroupContent className="relative">
          <SourceSelector />
        </SidebarGroupContent>

        <SidebarGroupContent className="relative">
          <CameraSelector />
        </SidebarGroupContent>

        <SidebarGroupContent className="relative">
          <LabelInput />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
