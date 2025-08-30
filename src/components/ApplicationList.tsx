import { deleteApplication } from "@/app/actions";
import type { Application as PrismaApplication } from "@prisma/client";
import { useCallback } from "react";
import { toast } from "sonner";
import ApplicationAccordionItem from "./ApplicationAccordionItem";
import ApplicationsHeader from "./ApplicationsHeader";
import NoJobApplications from "./NoJobApplications";
import { Accordion } from "./ui/accordion";

interface ApplicationListProps {
  applications: PrismaApplication[];
  onEdit: (application: PrismaApplication) => void;
  searchTerm: string;
  sortColumn: keyof PrismaApplication | null;
  sortDirection: "asc" | "desc";
  handleSort: (column: keyof PrismaApplication) => void;
}

export default function ApplicationList({
  applications,
  onEdit,
  searchTerm,
  sortColumn,
  sortDirection,
  handleSort,
}: ApplicationListProps) {
  const handleDeleteApplication = useCallback(async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const result = await deleteApplication(applicationId);

      if (result?.success) {
        // The parent component (DashboardClient) will handle updating the applications state
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
    <>
      {applications.length > 0 ? (
        <div className="mx-[-1rem] shadow-lg/10 sm:mx-auto sm:w-full">
          <ApplicationsHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <Accordion type="single" collapsible className="w-full">
            {applications.map((application) => (
              <ApplicationAccordionItem
                key={application.id}
                application={application}
                onDelete={handleDeleteApplication}
                onEdit={onEdit}
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
    </>
  );
}
