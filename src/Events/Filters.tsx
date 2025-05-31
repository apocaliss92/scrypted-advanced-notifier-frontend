import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function HeaderFilters() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white shadow">
      <Input placeholder="Cerca eventi..." className="w-full sm:w-1/3" />
      <Select>
        <SelectTrigger className="w-full sm:w-1/4">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tutti">Tutti</SelectItem>
          <SelectItem value="persona">Persona</SelectItem>
          <SelectItem value="movimento">Movimento</SelectItem>
        </SelectContent>
      </Select>
      <Button>Applica Filtri</Button>
    </div>
  );
}
