"use client";
import { useApplicationSearch } from "@/hooks/useApplicationSearch";
import { useSortableData } from "@/hooks/useSortableData";
import { prepareApplicationsForCsv } from "@/lib/utils";
import type { Application as PrismaApplication } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import AddApplicationModal from "./AddApplicationModal";
import ApplicationList from "./ApplicationList";
import EditApplicationModal from "./EditApplicationModal";
import ExportCSVButton from "./ExportCSVButton";
import ImportApplicationModal from "./ImportApplicationModal";
import SearchBar from "./SearchBar";

export default function DashboardClient({
  initialApplications,
}: {
  initialApplications: PrismaApplication[];
}) {
  const [applications, setApplications] =
    useState<PrismaApplication[]>(initialApplications);
  const { searchTerm, setSearchTerm, filteredApplications } =
    useApplicationSearch(applications);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<PrismaApplication | null>(null);

  // Preparing the data for a CSV file
  const dataForCsv = prepareApplicationsForCsv(applications);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

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

  const handleOpenEditModal = useCallback((application: PrismaApplication) => {
    setEditingApplication(application);
    setIsEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingApplication(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    handleEditModalClose();
  }, [handleEditModalClose]);

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

      {/* Edit application modal */}
      <EditApplicationModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        applicationData={editingApplication}
        onEditSuccess={handleEditSuccess}
      />

      {/* applications */}
      <ApplicationList
        applications={sortedApplications}
        onEdit={handleOpenEditModal}
        searchTerm={searchTerm}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
      />
    </div>
  );
}
