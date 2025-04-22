"use client";
import { deleteApplication } from "@/app/actions";
import { useSortableData } from "@/hooks/useSortableData";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function DashboardClient({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
  } = useSortableData(filteredApplications, "appliedAt", "desc");

  const handleOpenEditModal = useCallback((application) => {
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

  const handleDeleteApplication = useCallback(async (applicationId) => {
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
        toast.success("Application deleted successfully!", { icon: "🚮" });
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
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Add new application button */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full cursor-pointer hover:bg-sky-200 sm:w-auto"
              variant="outline"
            >
              Add new Application
            </Button>
          </DialogTrigger>

          {/* Add new application form */}
          <DialogContent className="sm:max-w-[425px] md:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add new Application</DialogTitle>
              <DialogDescription>
                Fill in the details for the job application you are applying for
              </DialogDescription>
            </DialogHeader>
            <AddApplicationForm onSuccess={handleAddModalClose} />
            <DialogFooter>
              <DialogClose className="cursor-pointer hover:underline">
                Cancel
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit application modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleEditModalClose}>
        <DialogContent className="sm:max-w-[425px] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>
              Update the details for this job application
            </DialogDescription>
          </DialogHeader>
          {editingApplication && (
            <EditApplicationForm
              applicationData={editingApplication}
              onSuccess={handleEditSuccess}
            />
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleEditModalClose}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
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
