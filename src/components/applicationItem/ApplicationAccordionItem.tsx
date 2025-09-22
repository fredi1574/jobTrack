"use client";
import { toggleApplicationPin } from "@/app/actions/application";
import { addInterviewToCalendar } from "@/lib/calendar";
import { getDaysSince } from "@/lib/date.utils";
import { getAccordionContentStyling } from "@/lib/utils";
import { Application as PrismaApplication } from "@prisma/client";
import { CalendarPlus, Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import DeleteApplicationModal from "../modal/DeleteApplicationModal";
import EditApplicationModal from "../modal/EditApplicationModal";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import ApplicationActions from "./ApplicationActions";
import ApplicationDetails from "./ApplicationDetails";
import DesktopLayout from "./layouts/DesktopLayout";
import MobileLayout from "./layouts/MobileLayout";

interface ApplicationAccordionItemProps {
  application: PrismaApplication;
}

export default function ApplicationAccordionItem({
  application,
}: ApplicationAccordionItemProps) {
  const accordionContentStyling = getAccordionContentStyling(
    application.status,
  );

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

  const handleAddToCalendar = (event: React.MouseEvent) => {
    event.stopPropagation();
    addInterviewToCalendar(application, session);
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
      className="bg-white transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900"
    >
      <AccordionTrigger className="group items-center gap-2 rounded-none px-3 py-4 hover:no-underline">
        <MobileLayout
          application={application}
          handlePinClick={handlePinClick}
          showNoResponseWarning={showNoResponseWarning}
          daysSinceLastStatusChange={daysSinceLastStatusChange}
        />
        <DesktopLayout
          application={application}
          handlePinClick={handlePinClick}
          showNoResponseWarning={showNoResponseWarning}
          daysSinceLastStatusChange={daysSinceLastStatusChange}
          formattedDate={formattedDate}
        />
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
          {/* Temporarily disabled until verified */}
          {/* {application.status === "Interview" && application.interviewDate && (
            <button
              onClick={handleAddToCalendar}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-300 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
            >
              <CalendarPlus className="size-3" />
              Calendar
            </button>
          )} */}
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
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
    </AccordionItem>
  );
}
