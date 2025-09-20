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
import { STATUS_ICONS } from "@/lib/constants";
import { getDaysSince } from "@/lib/date.utils";
import { formatDate, getUserTimeZone } from "@/lib/time.utils";
import { getAccordionContentStyling } from "@/lib/utils";
import { Application as PrismaApplication } from "@prisma/client";
import {
  Bell,
  CalendarPlus,
  ClockAlert,
  Pencil,
  Pin,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
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
  const accordionContentStyling = getAccordionContentStyling(
    application.status,
  );
  const router = useRouter();

  const { data: session } = useSession();

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

  const handleAddToCalendar = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!session) {
      toast.error("You need to be logged in to add to calendar.");
      return;
    }

    if (application.status !== "Interview" || !application.interviewDate) {
      toast.error("Only interviews with a set date can be added to calendar.");
      return;
    }

    const interviewDate = new Date(application.interviewDate);
    const startDate = interviewDate;
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `Interview - ${application.company} - ${application.position}`,
          description: `Interview for ${application.position} at ${application.company}.\nURL: ${application.url || "N/A"}`,
          startDateTime: startDate.toISOString(),
          endDateTime: endDate.toISOString(),
          timeZone: getUserTimeZone(),
        }),
      });

      if (response.ok) {
        toast.success("Interview added to Google Calendar!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add to Google Calendar.");
      }
    } catch (error) {
      console.error("Error adding to calendar:", error);
      toast.error("An unexpected error occurred.");
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
    <AccordionItem value={application.id} className="bg-white dark:bg-gray-900">
      <AccordionTrigger
        className={
          "group items-center gap-2 rounded-none p-3 hover:no-underline"
        }
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
                {STATUS_ICONS[application.status.toLowerCase()]}
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
                      <p>
                        {formatDate(
                          new Date(application.interviewDate),
                          "dd/MM/yy HH:mm",
                        )}
                      </p>
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
            <StatusDropdown application={application} />
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
                      <p>
                        {formatDate(
                          new Date(application.interviewDate),
                          "dd/MM/yy HH:mm",
                        )}
                      </p>
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
                  <TooltipContent color="red" className="flex flex-col gap-1">
                    <p>
                      {daysSinceLastStatusChange} days since last status change
                    </p>
                    <Button
                      onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        resetLastStatusChangeDate(application.id);
                        router.refresh();
                      }}
                      variant="default"
                      size="xs"
                      className="p-1.5"
                    >
                      Wait More
                    </Button>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="h-4 w-6" />
            )}
          </div>
          <div className="w-auto shrink-0">
            <ApplicationURL applicationUrl={application.url} />
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-3 pl-2 sm:flex">
          <ApplicationActions
            application={application}
            onEdit={handleEditClick}
            onAddToCalendar={handleAddToCalendar}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={`px-4 pt-2 pb-4 text-sm ${accordionContentStyling}`}
      >
        <ApplicationDetails application={application} />
        <div className="mt-4 flex justify-end gap-2 pt-2 md:hidden">
          {application.status === "Interview" && application.interviewDate && (
            <button
              onClick={handleAddToCalendar}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-300 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
            >
              <CalendarPlus className="size-3" />
              Calendar
            </button>
          )}
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
