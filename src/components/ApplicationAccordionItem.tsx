"use client";
import StatusDropdown from "@/components/applicationItem/StatusDropdown";
import { getAccordionContentStyling, getStatusStyling } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import ApplicationActions from "./applicationItem/ApplicationActions";
import ApplicationInfo from "./applicationItem/ApplicationInfo";
import ApplicationJobLink from "./applicationItem/ApplicationJobLink";
import ApplicationNotes from "./applicationItem/ApplicationNotes";
import ApplicationResume from "./applicationItem/ApplicationResume";
import ApplicationURL from "./applicationItem/ApplicationURL";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface ApplicationAccordionItemProps {
  application: any;
  onDelete: (id: string) => void;
  onEdit: (application: any) => void;
}

export default function ApplicationAccordionItem({
  application,
  onDelete,
  onEdit,
}: ApplicationAccordionItemProps) {
  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(application);
  };

  const handleDeleteClick = () => {
    onDelete(application.id);
  };

  const statusStyling = getStatusStyling(application.status);
  const accordionContentStyling = getAccordionContentStyling(
    application.status,
  );

  return (
    <AccordionItem
      value={application.id}
      className={`border-b last:border-b-0 dark:border-gray-700 ${statusStyling.background} ${statusStyling.border} ${statusStyling.hover}`}
    >
      <AccordionTrigger
        className={`items-center gap-2 rounded-none px-4 py-3 hover:no-underline ${statusStyling.background} ${statusStyling.text || ""}`}
      >
        {/* Main content div */}
        <div className="flex flex-1 items-center gap-4 overflow-hidden">
          <ApplicationInfo application={application} />

          <StatusDropdown application={application} />

          <ApplicationURL applicationUrl={application.url} />

          <ApplicationActions
            application={application}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={`px-0 pt-0 pb-0 text-sm ${accordionContentStyling}`}
      >
        <div className="space-y-4 rounded-b-lg p-5">
          <ApplicationNotes notes={application.notes} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ApplicationResume
              resumeUrl={application.resumeUrl}
              applicationId={application.id}
            />

            <ApplicationJobLink url={application.url} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleEditClick}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <Pencil className="size-3" />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-300 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <Trash2 className="size-3" />
              Delete
            </button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
