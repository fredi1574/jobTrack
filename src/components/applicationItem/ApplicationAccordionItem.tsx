"use client";
import { deleteApplication } from "@/app/actions/application";
import StatusDropdown from "@/components/applicationItem/StatusDropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAccordionContentStyling, getStatusStyling } from "@/lib/utils";
import { Application as PrismaApplication } from "@prisma/client";
import { format } from "date-fns";
import { Bell, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditApplicationModal from "../modal/EditApplicationModal";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import ApplicationActions from "./ApplicationActions";
import ApplicationDetails from "./ApplicationDetails";
import ApplicationURL from "./ApplicationURL";

interface ApplicationAccordionItemProps {
  application: PrismaApplication;
}

export default function ApplicationAccordionItem({
  application,
}: ApplicationAccordionItemProps) {
  const statusStyling = getStatusStyling(application.status);
  const accordionContentStyling = getAccordionContentStyling(
    application.status,
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<PrismaApplication | null>(null);

  const handleEditClick = (app: PrismaApplication) => {
    setEditingApplication(app);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const result = await deleteApplication(id);

      if (result?.success) {
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
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingApplication(null);
  };

  const formattedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString("en-IL")
    : "N/A";

  return (
    <AccordionItem
      value={application.id}
      className={`border-b last:border-b-0 dark:border-gray-700 ${statusStyling!.background} ${statusStyling!.border}`}
    >
      <AccordionTrigger
        className={`group items-center gap-2 rounded-none px-4 py-3 hover:no-underline ${statusStyling!.hover} ${statusStyling!.text}`}
      >
        {/* Mobile layout */}
        <div className="flex w-full items-center justify-between sm:hidden">
          <div className="flex flex-col items-start">
            <span className="truncate font-semibold">
              {application.company}
            </span>
            <span className="truncate text-sm text-gray-600 dark:text-gray-400">
              {application.position}
            </span>
          </div>
          <div className="flex items-center">
            {application.status === "Interview" && application.interviewDate ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="mr-2 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bell className="h-4 w-4 text-yellow-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className={undefined}>
                    <p>
                      {format(
                        new Date(application.interviewDate),
                        "d/M/yy 'at' HH:mm",
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="mr-2 h-4 w-6" />
            )}
            <StatusDropdown application={application} />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden w-full flex-1 items-center justify-around gap-4 overflow-hidden sm:flex">
          <span className="truncate font-semibold text-gray-900 sm:w-1/5 dark:text-gray-100">
            {application.company}
          </span>
          <span className="truncate text-gray-700 sm:w-1/5 dark:text-gray-300">
            {application.position}
          </span>
          <span className="truncate text-gray-500 sm:w-1/6 dark:text-gray-400">
            {application.location}
          </span>
          <span className="truncate text-gray-500 sm:w-1/6 dark:text-gray-400">
            {formattedDate}
          </span>
          <div className="flex items-center justify-center sm:w-1/6">
            {application.status === "Interview" && application.interviewDate ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="mr-2 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bell className="h-4 w-4 text-yellow-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className={undefined}>
                    <p>
                      {format(
                        new Date(application.interviewDate),
                        "d/M/yy 'at' HH:mm",
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="mr-2 h-4 w-6" />
            )}
            <StatusDropdown application={application} />
          </div>
          <div className="w-auto shrink-0">
            <ApplicationURL applicationUrl={application.url} />
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-3 pl-2 sm:flex">
          <ApplicationActions
            application={application}
            onEdit={handleEditClick}
            onDelete={() => handleDeleteClick(application.id)}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={`px-4 pt-2 pb-4 text-sm ${accordionContentStyling}`}
      >
        <ApplicationDetails application={application} />
        <div className="mt-4 flex justify-end gap-2 pt-2 md:hidden">
          <button
            onClick={() => handleEditClick(application)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            <Pencil className="size-3" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(application.id)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-300 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <Trash2 className="size-3" />
            Delete
          </button>
        </div>
      </AccordionContent>
      <EditApplicationModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        applicationData={editingApplication}
      />
    </AccordionItem>
  );
}
