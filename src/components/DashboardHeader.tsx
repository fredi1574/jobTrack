"use client";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { DrawerTrigger } from "@/components/ui/drawer";
import { Calendar } from "lucide-react";
import ExportCSVButton from "./ExportCSVButton";
import AddApplicationModal from "./modal/AddApplicationModal";
import ImportApplicationModal from "./modal/ImportApplicationModal";

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dataForCsv: any[];
}

export default function DashboardHeader({
  searchTerm,
  onSearchChange,
  dataForCsv,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-2xl font-bold md:text-3xl">
        Your Job Applications
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
        {/* Search bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />

        {/* Action buttons */}
        <div className="flex gap-2">
          <ImportApplicationModal />
          <ExportCSVButton data={dataForCsv} />
        </div>

        {/* Mobile Schedule Button */}
        <div className="md:hidden">
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full items-center gap-2"
              size={undefined}
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
          </DrawerTrigger>
        </div>

        {/* Add application modal */}
        <AddApplicationModal />
      </div>
    </div>
  );
}