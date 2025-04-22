import { useCallback, useMemo, useState } from "react";

export const SortDirection = {
  ASC: "asc",
  DESC: "desc",
};

export function useSortableData(
  initialData = [],
  defaultSortColumn,
  defaultSortDirection,
) {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const sortedData = useMemo(() => {
    if (!sortColumn) {
      return [...initialData];
    }

    const sortable = [...initialData];
    sortable.sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      let comparison = 0;

      if (valA === null || valA === undefined)
        return sortDirection === SortDirection.ASC ? -1 : 1;
      if (valB === null || valB === undefined)
        return sortDirection === SortDirection.ASC ? 1 : -1;

      if (valA instanceof Date && valB instanceof Date) {
        comparison = valA.getTime() - valB.getTime();
      } else if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.toLowerCase().localeCompare(valB.toLowerCase());
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
    (column) => {
      let nextDirection;

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
