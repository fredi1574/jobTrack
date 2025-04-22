import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
import { SortDirection } from "@/hooks/useSortableData";
import { Button } from "./ui/button";

const RenderSortIcon = ({ sortColumn, sortDirection, columnKey }) => {
  if (sortColumn !== columnKey) {
    return <ArrowDownUp className="ml-1 size-3 text-gray-400" />;
  }
  if (sortDirection === SortDirection.ASC) {
    return <ArrowUp className="ml-1 size-3 text-gray-600 dark:text-gray-300" />;
  }
  return <ArrowDown className="ml-1 size-3 text-gray-600 dark:text-gray-300" />;
};

export default function ApplicationsHeader({
  sortColumn,
  sortDirection,
  onSort,
}) {
  const SortableHeader = ({
    columnKey,
    label,
    className = "",
    justify = "justify-start",
  }) => (
    <button
      onClick={() => onSort(columnKey)}
      className={`flex items-center hover:text-gray-700 dark:hover:text-gray-200 ${justify} ${className}`}
    >
      {label}
      <RenderSortIcon
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        columnKey={columnKey}
      />
    </button>
  );

  return (
    <div className="hidden w-full border bg-gray-50 px-4 py-3 text-xs font-medium tracking-widest text-gray-500 sm:flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
      <div className="flex flex-1 items-center justify-around gap-4 overflow-hidden">
        <SortableHeader
          columnKey="company"
          label="Company"
          className="sm:w-1/5"
        />
        <SortableHeader
          columnKey="position"
          label="Position"
          className="sm:w-1/5"
        />
        <SortableHeader
          columnKey="location"
          label="Location"
          className="sm:w-1/6"
        />
        <SortableHeader
          columnKey="appliedAt"
          label="Date"
          className="sm:w-1/6"
        />
        <SortableHeader
          columnKey="status"
          label="Status"
          className="sm:w-1/6"
          justify="justify-center"
        />
        <span className="w-auto shrink-0">
          <div className="size-4" />
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3 pl-2">
        <span className="text-right">Actions</span>
      </div>
    </div>
  );
}
