"use client";
import { deleteApplication } from "@/app/actions";
import { useSortableData } from "@/hooks/useSortableData";
import type { Application as PrismaApplication } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import AddApplicationForm from "./AddApplicationForm";
import ApplicationAccordionItem from "./ApplicationAccordionItem";
import ApplicationsHeader from "./ApplicationsHeader";
import EditApplicationForm from "./EditApplicationForm";
import NoJobApplications from "./NoJobApplications";
import { Accordion } from "./ui/accordion";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function DashboardClient({
  initialApplications,
}: {
  initialApplications: PrismaApplication[];
}) {
  const [applications, setApplications] =
    useState<PrismaApplication[]>(initialApplications);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<PrismaApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Preparing the data for a CSV file
  const dataForCsv = applications.map((application) => {
    const { id, UserId, resumeUrl, appliedAt, updatedAt, ...restOfData } =
      application;

    return {
      ...restOfData,
      appliedAt: appliedAt
        ? new Date(appliedAt).toLocaleDateString("en-IL")
        : "",
      updatedAt: updatedAt
        ? new Date(updatedAt).toLocaleDateString("en-IL")
        : "",
    };
  });

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  const filteredApplications = applications.filter((application) => {
    return (
      application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  const handleAddModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleDeleteApplication = useCallback(async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const result = await deleteApplication(applicationId);

      if (result?.success) {
        setApplications((currentApplications) =>
          currentApplications.filter(
            (application) => application.id !== applicationId,
          ),
        );
        toast.success("Application deleted successfully!", {
          icon: <span>🚮</span>,
        });
      } else {
        toast.error(result?.error || "Failed to delete application.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          Your Job Applications
        </h1>

        {/* Search bar */}
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search applications..."
              className="pl-10"
              value={searchTerm}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>
        </div>

        <div className="flex w-full justify-between gap-4 md:justify-end">
          <Button
            variant="outline"
            size="lg"
            className="w-1/3 p-5 hover:bg-sky-200/50 md:absolute md:right-4 md:bottom-6 md:w-1/12"
            asChild
          >
            <CSVLink
              data={dataForCsv}
              filename={`job-applications - ${new Date().toLocaleDateString("en-IL")} - ${new Date().toLocaleTimeString("en-IL")}.csv`}
            >
              Download CSV
            </CSVLink>
          </Button>

          {/* Add new application button */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-1/2 cursor-pointer p-5 hover:bg-sky-200/50 md:w-1/4"
                size="sm"
                variant="outline"
              >
                Add new Application
              </Button>
            </DialogTrigger>

            {/* Add new application form */}
            <DialogContent className="flex max-h-[85vh] flex-col overflow-y-auto sm:max-h-[90vh] sm:max-w-lg">
              <DialogHeader className="">
                <DialogTitle>Add new Application</DialogTitle>
                <DialogDescription className="">
                  Fill in the details for the job application you are applying
                  for
                </DialogDescription>
              </DialogHeader>
              <div className="flex-grow py-4 pr-6 pl-1">
                <AddApplicationForm onSuccess={handleAddModalClose} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit application modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleEditModalClose}>
        <DialogContent className="flex max-h-[85vh] flex-col overflow-y-auto sm:max-h-[90vh] sm:max-w-lg">
          <DialogHeader className="">
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription className="">
              Update the details for this job application
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow py-4 pr-6 pl-1">
            {editingApplication && (
              <EditApplicationForm
                applicationData={editingApplication}
                onSuccess={handleEditSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* applications */}
      {filteredApplications.length > 0 ? (
        <div className="shadow-lg">
          <ApplicationsHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <Accordion type="single" collapsible className="w-full">
            {sortedApplications.map((application) => (
              <ApplicationAccordionItem
                key={application.id}
                application={application}
                onDelete={handleDeleteApplication}
                onEdit={handleOpenEditModal}
              />
            ))}
          </Accordion>
        </div>
      ) : searchTerm ? (
        <p className="mt-10 text-center text-gray-500">
          No applications match your search term &quot;{searchTerm}&quot;.
        </p>
      ) : (
        <NoJobApplications />
      )}
    </div>
  );
}
