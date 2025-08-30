"use client";
import { deleteApplication } from "@/app/actions";
import { useSortableData } from "@/hooks/useSortableData";
import type { Application as PrismaApplication } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Download, PlusCircle, Search, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "sonner";
import AddApplicationForm from "./AddApplicationForm";
import ApplicationAccordionItem from "./ApplicationAccordionItem";
import ApplicationsHeader from "./ApplicationsHeader";
import { CSVImportForm } from "./CSVImportForm";
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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<PrismaApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Preparing the data for a CSV file
  const dataForCsv = applications.map((application) => {
    const { id, UserId, resumeUrl, appliedAt, updatedAt, ...restOfData } =
      application;

    return {
      ...restOfData,
      appliedAt: appliedAt ? formatDate(appliedAt) : "",
      updatedAt: updatedAt ? formatDate(updatedAt) : "",
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
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          Your Job Applications
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
          {/* Search bar */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search applications..."
              className="bg-white pl-10 dark:bg-slate-800"
              value={searchTerm}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>
          {/* Action buttons */}
          <div className="flex gap-2">
            <Dialog
              open={isImportModalOpen}
              onOpenChange={setIsImportModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={undefined}
                  size={undefined}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent className={undefined}>
                <DialogHeader className={undefined}>
                  <DialogTitle>Import from CSV</DialogTitle>
                </DialogHeader>
                <CSVImportForm onSuccess={() => setIsImportModalOpen(false)} />
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              asChild
              className={undefined}
              size={undefined}
            >
              <CSVLink
                data={dataForCsv}
                filename={`job-applications - ${formatDate(new Date())}.csv`}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </CSVLink>
            </Button>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-green-500/70 text-green-900 hover:bg-green-700 dark:text-white"
                variant={undefined}
                size={undefined}
              >
                <PlusCircle className="h-4 w-4" />
                Add Application
              </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[85vh] flex-col overflow-y-auto sm:max-h-[90vh] sm:max-w-lg">
              <DialogHeader className={undefined}>
                <DialogTitle>Add new Application</DialogTitle>
                <DialogDescription className={undefined}>
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
          <DialogHeader className={undefined}>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription className={undefined}>
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
        <div className="mx-[-1rem] shadow-lg/10 sm:mx-auto sm:w-full">
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
