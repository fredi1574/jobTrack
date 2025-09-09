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
import { motion } from "motion/react";
import { useState } from "react";
import ApplicationList from "./ApplicationList";
import DashboardHeader from "./DashboardHeader";
import ScheduleView from "./ScheduleView";
import GlobalFilters from "./filters/GlobalFilters";

interface FilterState {
  status: string;
  location: string;
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

      return statusMatch && locationMatch && searchTermMatch;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <Drawer direction="right">
        <div className="container mx-auto p-4 md:p-6 lg:p-10">
          <DashboardHeader dataForCsv={dataForCsv} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlobalFilters
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
          </motion.div>

          {/* applications */}
          <ApplicationList
            applications={sortedApplications}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        </div>

        {/* Desktop Schedule Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="hidden md:block"
        >
          <DrawerTrigger asChild>
            <Button
              variant="secondary"
              className="fixed top-1/2 -right-2 z-10 flex h-14 w-24 -translate-y-1/2 gap-2 rounded-l-md rounded-r-none border-r-0"
              size={undefined}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Schedule</span>
            </Button>
          </DrawerTrigger>
        </motion.div>

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
    </motion.div>
  );
}
