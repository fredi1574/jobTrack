import { useCallback, useMemo, useState } from "react";

export const SortDirection = {
  ASC: "asc",
  DESC: "desc",
} as const;

type SortDirectionType = typeof SortDirection.ASC | typeof SortDirection.DESC;

interface UseSortableDataReturn<T> {
  sortedData: T[];
  sortColumn: keyof T | null;
  sortDirection: SortDirectionType;
  handleSort: (columnKey: keyof T) => void;
}

function isValidDateValue(value: unknown): value is Date | string | number {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  if (typeof value === "string" || typeof value === "number") {
    if (typeof value === "string" && value.trim() === "") return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  return false;
}

export function useSortableData<T extends Record<string, any>>(
  initialData: T[] = [],
  defaultSortColumn: keyof T | null = null,
  defaultSortDirection: SortDirectionType = SortDirection.ASC,
): UseSortableDataReturn<T> {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(
    defaultSortColumn,
  );
  const [sortDirection, setSortDirection] =
    useState<SortDirectionType>(defaultSortDirection);

  const sortedData = useMemo<T[]>(() => {
    if (!sortColumn) {
      return [...initialData];
    }

    const sortable = [...initialData];

    sortable.sort((a: T, b: T) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      let comparison = 0;

      if (valA === null || valA === undefined)
        return sortDirection === SortDirection.ASC ? -1 : 1;
      if (valB === null || valB === undefined)
        return sortDirection === SortDirection.ASC ? 1 : -1;

      const isADate = isValidDateValue(valA);
      const isBDate = isValidDateValue(valB);

      if (isADate && isBDate) {
        const dateA = new Date(valA);
        const dateB = new Date(valB);
        comparison = dateA.getTime() - dateB.getTime();
      } else if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      } else {
        const stringA = String(valA).toLowerCase();
        const stringB = String(valB).toLowerCase();
        comparison = stringA.localeCompare(stringB);
      }

      return sortDirection === SortDirection.ASC ? comparison : -comparison;
    });
    return sortable;
  }, [initialData, sortColumn, sortDirection]);

  const handleSort = useCallback(
    (column: keyof T) => {
      let nextDirection: SortDirectionType;

      if (sortColumn === column) {
        nextDirection =
          sortDirection === SortDirection.ASC
            ? SortDirection.DESC
            : SortDirection.ASC;
      } else {
        nextDirection = SortDirection.ASC;
      }

      setSortColumn(column);
      setSortDirection(nextDirection);
    },
    [sortColumn, sortDirection],
  );

  return { sortedData, sortColumn, sortDirection, handleSort };
}
