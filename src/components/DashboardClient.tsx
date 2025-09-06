"use client";
import SearchBar from "@/components/header/SearchBar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplicationSearch } from "@/hooks/useApplicationSearch";
import { useSortableData } from "@/hooks/useSortableData";
import { prepareApplicationsForCsv } from "@/lib/csv.utils";
import type { Application } from "@prisma/client";
import ApplicationList from "./ApplicationList";
import ExportCSVButton from "./ExportCSVButton";
import AddApplicationModal from "./modal/AddApplicationModal";
import ImportApplicationModal from "./modal/ImportApplicationModal";
import ScheduleView from "./ScheduleView";

export default function DashboardClient({
  initialApplications,
}: {
  initialApplications: Application[];
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
  } = useSortableData<Application>(filteredApplications, "appliedAt", "desc");

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

          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                size={undefined}
              >
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
            </DrawerTrigger>
            <DrawerContent className="flex h-full flex-col">
              <DrawerTitle className="my-2 text-center text-xl font-bold">
                Schedule
              </DrawerTitle>
              <DrawerDescription className="text-center text-gray-500">
                Your upcoming interviews
              </DrawerDescription>
              <ScheduleView applications={initialApplications} />
            </DrawerContent>
          </Drawer>

          {/* Add application modal */}
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
