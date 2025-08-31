"use client";
import SearchBar from "@/components/header/SearchBar";
import { useApplicationSearch } from "@/hooks/useApplicationSearch";
import { useSortableData } from "@/hooks/useSortableData";
import { prepareApplicationsForCsv } from "@/lib/csv.utils";
import type { Application as PrismaApplication } from "@prisma/client";
import ApplicationList from "./ApplicationList";
import ExportCSVButton from "./ExportCSVButton";
import AddApplicationModal from "./modal/AddApplicationModal";
import ImportApplicationModal from "./modal/ImportApplicationModal";

export default function DashboardClient({
  initialApplications,
}: {
  initialApplications: PrismaApplication[];
}) {
  const { searchTerm, setSearchTerm, filteredApplications } =
    useApplicationSearch(initialApplications);

  // Preparing the data for a CSV file
  const dataForCsv = prepareApplicationsForCsv(initialApplications);

  const {
    sortedData: sortedApplications,
    sortColumn,
    sortDirection,
    handleSort,
  } = useSortableData<PrismaApplication>(
    filteredApplications,
    "appliedAt",
    "desc",
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          Your Job Applications
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
          {/* Search bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(term: string) => setSearchTerm(term)}
          />

          {/* Action buttons */}
          <div className="flex gap-2">
            <ImportApplicationModal />
            <ExportCSVButton data={dataForCsv} />
          </div>

          <AddApplicationModal />
        </div>
      </div>

      {/* applications */}
      <ApplicationList
        applications={sortedApplications}
        searchTerm={searchTerm}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
      />
    </div>
  );
}
