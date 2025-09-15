"use client";
import {
  resetLastStatusChangeDate,
  toggleApplicationPin,
} from "@/app/actions/application";
import StatusDropdown from "@/components/applicationItem/StatusDropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getDaysSince } from "@/lib/date.utils";
import { getAccordionContentStyling, getStatusStyling } from "@/lib/utils";
import { Application as PrismaApplication } from "@prisma/client";
import { Bell, ClockAlert, Pencil, Pin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteApplicationModal from "../modal/DeleteApplicationModal";
import EditApplicationModal from "../modal/EditApplicationModal";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
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
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<PrismaApplication | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApplication, setDeletingApplication] =
    useState<PrismaApplication | null>(null);

  const handleEditClick = (app: PrismaApplication) => {
    setEditingApplication(app);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingApplication(null);
  };

  const handleDeleteClick = (app: PrismaApplication) => {
    setDeletingApplication(app);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingApplication(null);
  };

  const handlePinClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const result = await toggleApplicationPin(
      application.id,
      application.pinned,
    );
    if (result.success) {
      toast.success(
        application.pinned ? "Application unpinned" : "Application pinned",
      );
    } else {
      toast.error(result.error);
    }
  };

  const formattedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString("en-IL")
    : "N/A";

  const daysSinceLastStatusChange = application.lastStatusChangeDate
    ? getDaysSince(application.lastStatusChangeDate)
    : 0;

  const showNoResponseWarning = daysSinceLastStatusChange > 7;

  return (
    <AccordionItem
      value={application.id}
      className={`${statusStyling!.background} ${statusStyling!.border}`}
    >
      <AccordionTrigger
        className={`group items-center gap-2 rounded-none p-3 hover:no-underline ${statusStyling!.hover} ${statusStyling!.text}`}
      >
        {/* Mobile layout */}
        <div className="flex w-full items-center justify-between sm:hidden">
          <div className="flex min-w-0 items-center">
            <Pin
              onClick={handlePinClick}
              className={`mr-4 size-4 shrink-0 cursor-pointer ${
                application.pinned
                  ? "rotate-45 fill-blue-500 text-blue-500"
                  : "text-gray-500"
              } hover:text-blue-500 dark:hover:text-blue-400`}
              aria-label="Pin Application"
            />
            <div className="flex flex-col">
              <span className="flex items-center gap-1 break-all">
                {application.company}
              </span>
              <span className="text-sm break-all text-gray-600 dark:text-gray-400">
                {application.position}
              </span>
            </div>
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
                  <TooltipContent
                    side="left"
                    color="purple"
                    className={undefined}
                  >
                    <p>
                      {(() => {
                        const date = new Date(application.interviewDate);
                        const day = date
                          .getUTCDate()
                          .toString()
                          .padStart(2, "0");
                        const month = (date.getUTCMonth() + 1)
                          .toString()
                          .padStart(2, "0");
                        const year = date.getUTCFullYear().toString().slice(-2);
                        const hours = date
                          .getUTCHours()
                          .toString()
                          .padStart(2, "0");
                        const minutes = date
                          .getUTCMinutes()
                          .toString()
                          .padStart(2, "0");
                        return `${day}/${month}/${year} at ${hours}:${minutes}`;
                      })()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : showNoResponseWarning ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="mr-2 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ClockAlert className="size-4 text-red-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent color="red" className={undefined}>
                    <p>
                      {daysSinceLastStatusChange} days since last status change
                    </p>
                    <Button
                      onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        resetLastStatusChangeDate(application.id);
                        router.refresh();
                      }}
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-white"
                    >
                      Wait More
                    </Button>
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
          <div className="flex items-center gap-1 sm:w-1/5">
            <Pin
              onClick={handlePinClick}
              className={`hover:bg-accent-foreground/10 mr-2 size-4 shrink-0 cursor-pointer rounded-full transition-colors ${
                application.pinned
                  ? "rotate-45 fill-blue-500 text-blue-500"
                  : "text-gray-500"
              } hover:text-blue-500 dark:hover:text-blue-400`}
              aria-label="Pin Application"
            />
            <span className="break-all text-gray-900 dark:text-gray-100">
              {application.company}
            </span>
          </div>
          <span className="break-all text-gray-700 sm:w-1/5 dark:text-gray-300">
            {application.position}
          </span>
          <span className="text-gray-500 sm:w-1/6 dark:text-gray-400">
            {application.location}
          </span>
          <span className="text-gray-500 sm:w-1/6 dark:text-gray-400">
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
                  <TooltipContent
                    side="left"
                    color="purple"
                    className={undefined}
                  >
                    <p>
                      {(() => {
                        const date = new Date(application.interviewDate);
                        const day = date
                          .getUTCDate()
                          .toString()
                          .padStart(2, "0");
                        const month = (date.getUTCMonth() + 1)
                          .toString()
                          .padStart(2, "0");
                        const year = date.getUTCFullYear().toString().slice(-2);
                        const hours = date
                          .getUTCHours()
                          .toString()
                          .padStart(2, "0");
                        const minutes = date
                          .getUTCMinutes()
                          .toString()
                          .padStart(2, "0");
                        return `${day}/${month}/${year} at ${hours}:${minutes}`;
                      })()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : showNoResponseWarning ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="mr-2 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ClockAlert className="h-4 w-4 text-red-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    color="red"
                    className="flex items-center gap-1"
                  >
                    <p>
                      {daysSinceLastStatusChange} days since last status change
                    </p>
                    <Button
                      onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        resetLastStatusChangeDate(application.id);
                        router.refresh();
                      }}
                      variant="ghost"
                      size="xs"
                      className="bg-transparent px-1 text-white"
                    >
                      Wait More
                    </Button>
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
            onClick={() => handleDeleteClick(application)}
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
      <DeleteApplicationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        applicationId={deletingApplication?.id || ""}
      />
    </AccordionItem>
  );
}
