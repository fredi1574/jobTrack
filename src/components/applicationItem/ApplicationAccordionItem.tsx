"use client";
import { deleteApplication } from "@/app/actions/application";
import StatusDropdown from "@/components/applicationItem/StatusDropdown";
import { getAccordionContentStyling, getStatusStyling } from "@/lib/utils";
import { Application as PrismaApplication } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditApplicationModal from "../modal/EditApplicationModal";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import ApplicationActions from "./ApplicationActions";
import ApplicationInfo from "./ApplicationInfo";
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

  return (
    <AccordionItem
      value={application.id}
      className={`border-b last:border-b-0 dark:border-gray-700 ${statusStyling!.background} ${statusStyling!.border}`}
    >
      <AccordionTrigger
        className={`group items-center gap-2 rounded-none px-4 py-3 hover:no-underline ${statusStyling!.hover} ${statusStyling!.text}`}
      >
        {/* Main content div */}
        <div className="flex flex-1 items-center gap-4 overflow-hidden">
          <ApplicationInfo application={application} />

          <StatusDropdown application={application} />

          <ApplicationURL applicationUrl={application.url} />

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
