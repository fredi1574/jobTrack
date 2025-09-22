"use client";
import { toggleApplicationPin } from "@/app/actions/application";
import { addInterviewToCalendar } from "@/lib/calendar";
import { getDaysSince } from "@/lib/date.utils";
import { getAccordionContentStyling } from "@/lib/utils";
import { Application as PrismaApplication } from "@prisma/client";
import { HandCoins, Pencil, Sparkles, Trash2 } from "lucide-react";
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

  const [showSalaryEstimation, setShowSalaryEstimation] = useState(false);
  const [salaryEstimationData, setSalaryEstimationData] = useState<any>(null);
  const [isLoadingSalaryEstimation, setIsLoadingSalaryEstimation] =
    useState(false);
  const [salaryEstimationError, setSalaryEstimationError] = useState<
    string | null
  >(null);

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

  const handleSalaryEstimationClick = async () => {
    setShowSalaryEstimation((prev) => !prev);
    if (!showSalaryEstimation && !salaryEstimationData) {
      setIsLoadingSalaryEstimation(true);
      setSalaryEstimationError(null);
      try {
        const response = await fetch(
          `/api/salary-estimation?position=${encodeURIComponent(application.position)}&location=${encodeURIComponent(application.location)}&company=${encodeURIComponent(application.company)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch salary estimation");
        }
        const data = await response.json();
        setSalaryEstimationData(data);
      } catch (error: any) {
        setSalaryEstimationError(error.message || "An unknown error occurred");
        toast.error("Failed to fetch salary estimation.");
      } finally {
        setIsLoadingSalaryEstimation(false);
      }
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
      className="bg-card transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
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
            onSalaryEstimation={handleSalaryEstimationClick}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={`px-4 pt-2 pb-4 text-sm ${accordionContentStyling}`}
      >
        <ApplicationDetails application={application} />
        {showSalaryEstimation && (
          <div className="bg-card mt-4 rounded-md border p-4">
            <div className="flex gap-2">
              <HandCoins className="size-4" />
              <h4 className="mb-2 font-semibold">Salary Estimation</h4>
            </div>
            {isLoadingSalaryEstimation && <p>Loading salary estimation...</p>}
            {salaryEstimationError && (
              <p className="text-red-500">Error: {salaryEstimationError}</p>
            )}
            {salaryEstimationData && (
              <div>
                <p>
                  <strong>Position:</strong> {salaryEstimationData.position}
                </p>
                <p>
                  <strong>Location:</strong> {salaryEstimationData.location}
                </p>
                <p>
                  <strong>Company:</strong> {salaryEstimationData.company}
                </p>
                <p>
                  <strong>Estimated Range:</strong>{" "}
                  {salaryEstimationData.salaryRange}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {salaryEstimationData.message}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
                  Please note: This salary estimation is based on available data
                  and may not be entirely accurate. It should be used as a
                  general guide.
                </p>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 flex justify-end gap-2 pt-2 md:hidden">
          <button
            onClick={handleSalaryEstimationClick}
            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-600 transition-colors hover:bg-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
          >
            <Sparkles className="size-3" />
            AI Salary Estimation
          </button>
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
