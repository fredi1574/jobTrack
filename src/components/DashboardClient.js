"use client";
import { deleteApplication } from "@/app/actions";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddApplicationForm from "./AddApplicationForm";
import ApplicationAccordionItem from "./ApplicationAccordionItem";
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
import { Search } from "lucide-react";

// TODO: Add ability to edit application
export default function DashboardClient({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  const filteredApplications = applications.filter((application) => {
    return (
      application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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
        toast.success("Application deleted successfully!");
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
            <AddApplicationForm onSuccess={handleModalClose} />
            <DialogFooter>
              <DialogClose className="cursor-pointer hover:underline">
                Cancel
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* applications */}
      {filteredApplications.length > 0 ? (
        <div className="border">
          <div className="hidden w-full items-center justify-between gap-4 border-b bg-gray-50 px-4 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase sm:flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <div className="flex flex-1 items-center gap-4 overflow-hidden">
              <span className="sm:w-1/5">Company</span>
              <span className="sm:w-1/5">Position</span>
              <span className="sm:w-1/6">Location</span>
              <span className="sm:w-1/6">Date</span>
              <span className="text-center sm:w-1/6">Status</span>
              <span className="w-auto shrink-0" aria-hidden="true">
                <div className="size-4"></div>
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-3 pl-2">
              <span className="text-right">Actions</span>
            </div>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full border border-gray-200 shadow-md"
          >
            {filteredApplications.map((application) => (
              <ApplicationAccordionItem
                key={application.id}
                application={application}
                onDelete={handleDeleteApplication}
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
