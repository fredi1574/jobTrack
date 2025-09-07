"use client";
"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSortableData } from "@/hooks/useSortableData";
import { prepareApplicationsForCsv } from "@/lib/csv.utils";
import type { Application } from "@prisma/client";
import { Calendar } from "lucide-react";
import { useState } from "react";
import ApplicationList from "./ApplicationList";
import DashboardHeader from "./DashboardHeader";
import ScheduleView from "./ScheduleView";
import GlobalFilters from "./filters/GlobalFilters";

interface FilterState {
  status: string;
  location: string;
  dateRange: { from?: Date; to?: Date };
  searchTerm: string;
}

export default function DashboardClient({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    location: "",
    dateRange: { from: undefined, to: undefined },
    searchTerm: "",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const applyFilters = (
    applications: Application[],
    currentFilters: FilterState,
  ) => {
    return applications.filter((app) => {
      const statusMatch = currentFilters.status
        ? app.status === currentFilters.status
        : true;
      const locationMatch = currentFilters.location
        ? app.location === currentFilters.location
        : true;

      const dateMatch =
        currentFilters.dateRange.from && currentFilters.dateRange.to
          ? app.appliedAt &&
            new Date(app.appliedAt) >= currentFilters.dateRange.from &&
            new Date(app.appliedAt) <=
              new Date(
                new Date(currentFilters.dateRange.to).setHours(23, 59, 59, 999),
              )
          : true;

      const searchTermMatch = currentFilters.searchTerm
        ? app.company
            .toLowerCase()
            .includes(currentFilters.searchTerm.toLowerCase()) ||
          app.position
            .toLowerCase()
            .includes(currentFilters.searchTerm.toLowerCase()) ||
          (app.location &&
            app.location
              .toLowerCase()
              .includes(currentFilters.searchTerm.toLowerCase()))
        : true;

      return statusMatch && locationMatch && dateMatch && searchTermMatch;
    });
  };

  const filteredApplications = applyFilters(initialApplications, filters);

  // Preparing the data for a CSV file
  const dataForCsv = prepareApplicationsForCsv(initialApplications);

  const {
    sortedData: sortedApplications,
    sortColumn,
    sortDirection,
    handleSort,
  } = useSortableData<Application>(filteredApplications, "appliedAt", "desc");

  return (
    <div className="relative">
      <Drawer direction="right">
        <div className="container mx-auto p-4 md:p-6 lg:p-10">
          <DashboardHeader dataForCsv={dataForCsv} />

          <GlobalFilters
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />

          {/* applications */}
          <ApplicationList
            applications={sortedApplications}
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
