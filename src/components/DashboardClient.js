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

// TODO: Add ability to edit application
// TODO: Add shadcn's accordion, each row is an accordion item, when clicked, show details of application with addition of notes and resume file
export default function DashboardClient({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

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
    <div className="container mx-auto p-4 md:p-10">
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          Your Job Applications
        </h1>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="cursor-pointer hover:bg-sky-200"
              variant="outline"
            >
              Add new Application
            </Button>
          </DialogTrigger>

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

      <div className="">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="divide-x divide-gray-200">
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Position
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Status
              </th>

              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {applications.length > 0 ? (
        <div className="rounded-lg border shadow-md">
          <Accordion type="single" collapsible className="w-full">
            {applications.map((application) => (
              <ApplicationAccordionItem
                key={application.id}
                application={application}
                onDelete={handleDeleteApplication}
              />
            ))}
          </Accordion>
        </div>
      ) : (
        //
        // ) :
        <NoJobApplications />
      )}
    </div>
  );
}
