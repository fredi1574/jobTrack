"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useApplicationSearch } from "@/hooks/useApplicationSearch";
import { useSortableData } from "@/hooks/useSortableData";
import { prepareApplicationsForCsv } from "@/lib/csv.utils";
import type { Application } from "@prisma/client";
import { Calendar } from "lucide-react";
import ApplicationList from "./ApplicationList";
import DashboardHeader from "./DashboardHeader";
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
    <div className="relative min-h-screen">
      <Drawer direction="right">
        <div className="container mx-auto p-4 md:p-6 lg:p-10">
          <DashboardHeader
            searchTerm={searchTerm}
            onSearchChange={(term: string) => setSearchTerm(term)}
            dataForCsv={dataForCsv}
          />

          {/* applications */}
          <ApplicationList
            applications={sortedApplications}
            searchTerm={searchTerm}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        </div>

        {/* Desktop Schedule Button */}
        <div className="hidden md:block">
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="fixed top-1/2 -right-2 z-10 flex h-14 w-24 -translate-y-1/2 gap-2 rounded-l-md rounded-r-none border-r-0"
              size={undefined}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Schedule</span>
            </Button>
          </DrawerTrigger>
        </div>

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
    </div>
  );
}
