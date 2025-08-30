import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
}: SearchBarProps) {
  return (
    <div className="relative w-full sm:w-64 md:w-72">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder="Search applications..."
        className="bg-white pl-10 dark:bg-slate-800"
        value={searchTerm}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSearchChange(event.target.value)
        }
      />
    </div>
  );
}
