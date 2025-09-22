import { SortDirection } from "@/hooks/useSortableData";
import type { Application as PrismaApplication } from "@prisma/client";
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";

type SortColumnKey = keyof PrismaApplication;
type SortDirection = typeof SortDirection.ASC | typeof SortDirection.DESC;

interface RenderSortIconProps {
  sortColumn: SortColumnKey | null;
  sortDirection: SortDirection;
  columnKey: SortColumnKey;
}

const RenderSortIcon = ({
  sortColumn,
  sortDirection,
  columnKey,
}: RenderSortIconProps) => {
  if (sortColumn !== columnKey) {
    return <ArrowDownUp className="ml-1 size-3 text-gray-400" />;
  }
  if (sortDirection === SortDirection.ASC) {
    return <ArrowUp className="ml-1 size-3 text-gray-600 dark:text-gray-300" />;
  }
  return <ArrowDown className="ml-1 size-3 text-gray-600 dark:text-gray-300" />;
};

interface ApplicationsHeaderProps {
  sortColumn: SortColumnKey | null;
  sortDirection: SortDirection;
  onSort: (columnKey: SortColumnKey) => void;
}

export default function ApplicationsHeader({
  sortColumn,
  sortDirection,
  onSort,
}: ApplicationsHeaderProps) {
  interface SortableHeaderProps {
    columnKey: SortColumnKey;
    label: string;
    className?: string;
    justify?: string;
  }

  const SortableHeader = ({
    columnKey,
    label,
    className = "",
    justify = "justify-start",
  }: SortableHeaderProps) => (
    <button
      type="button"
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
    <div className="hidden w-full rounded-t-xl border bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 sm:flex dark:border-gray-700 dark:bg-[#1f1f1f] dark:text-gray-400">
      <div className="flex flex-1 items-center justify-around gap-4 overflow-hidden">
        <div className="flex items-center gap-1 sm:w-1/5">
          <div className="mr-2 size-4" />
          <SortableHeader columnKey="company" label="Company" />
        </div>
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
        <div className="w-auto shrink-0">
          <div className="size-4" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 pl-2">
        <span className="text-right">Actions</span>
      </div>
    </div>
  );
}
