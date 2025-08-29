"use client";
import { removeResume } from "@/app/actions";
import StatusDropdown from "@/components/applicationItem/StatusDropdown";
import {
  ClipboardList,
  Download,
  FileText,
  LinkIcon,
  Pencil,
  Trash,
  Trash2,
} from "lucide-react";
import ApplicationActions from "./applicationItem/ApplicationActions";
import ApplicationInfo from "./applicationItem/ApplicationInfo";
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

// Utility function to get status-based styling
const getStatusStyling = (status: string) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case "applied":
      return {
        background: "bg-sky-50 dark:bg-sky-900/20",
        border: "border-l-4 border-l-sky-500 dark:border-l-sky-800",
        hover: "hover:bg-sky-100 dark:hover:bg-sky-900/30",
      };
    case "assessment":
      return {
        background: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-l-4 border-l-yellow-500 dark:border-l-yellow-800",
        hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
      };
    case "interview":
      return {
        background: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-l-4 border-l-purple-500 dark:border-l-purple-800",
        hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      };
    case "offer":
      return {
        background: "bg-green-50 dark:bg-green-900/20",
        border: "border-l-4 border-l-green-500 dark:border-l-green-800",
        hover: "hover:bg-green-100 dark:hover:bg-green-900/30",
      };
    case "rejected":
      return {
        background: "bg-red-50 dark:bg-red-900/20",
        border: "border-l-4 border-l-red-500 dark:border-l-red-800",
        hover: "hover:bg-red-100 dark:hover:bg-red-900/30",
        text: "text-gray-400 line-through opacity-70 dark:text-red-400",
      };
    default:
      return {
        background: "bg-gray-50 dark:bg-gray-800/20",
        border: "border-l-4 border-l-gray-400 dark:border-l-gray-600",
        hover: "hover:bg-gray-100 dark:hover:bg-gray-800/30",
      };
  }
};

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

  const handleDeleteResumeClick = () => {
    removeResume(application.id);
  };

  const statusStyling = getStatusStyling(application.status);

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
        className={`px-0 pt-0 pb-0 text-sm ${
          application.status.toLowerCase() === "rejected"
            ? "bg-red-50/50 text-gray-600 dark:bg-red-800/40 dark:text-gray-300"
            : application.status.toLowerCase() === "offer"
              ? "bg-green-50/50 text-gray-600 dark:bg-green-800/40 dark:text-gray-300"
              : application.status.toLowerCase() === "applied"
                ? "bg-sky-50/50 text-gray-600 dark:bg-sky-800/40 dark:text-gray-300"
                : application.status.toLowerCase() === "assessment"
                  ? "bg-yellow-50/50 text-gray-600 dark:bg-yellow-800/40 dark:text-gray-300"
                  : application.status.toLowerCase() === "interview"
                    ? "bg-purple-50/50 text-gray-600 dark:bg-purple-800/40 dark:text-gray-300"
                    : "bg-gray-50/50 text-gray-600 dark:bg-slate-500"
        }`}
      >
        <div className="space-y-4 rounded-b-lg p-5">
          {application.notes ? (
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                <ClipboardList className="size-4" />
                Notes
              </h4>
              <div className="pl-1 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {application.notes}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                <ClipboardList className="size-4" />
                Notes
              </h4>
              <p className="pl-1 text-gray-500 italic dark:text-gray-400">
                No notes added.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                <FileText className="size-4" />
                Resume
              </h4>
              {application.resumeUrl ? (
                <div className="flex items-center justify-between">
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Download className="size-4" />
                    View Resume
                  </a>
                  <Trash
                    onClick={handleDeleteResumeClick}
                    className="ml-2 size-4 cursor-pointer text-gray-500 hover:text-red-600"
                  />
                </div>
              ) : (
                <p className="text-gray-500 italic dark:text-gray-400">
                  No resume uploaded.
                </p>
              )}
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                <LinkIcon className="size-4" />
                Job Link
              </h4>
              {application.url ? (
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {application.url}
                </a>
              ) : (
                <p className="text-gray-500 italic dark:text-gray-400">
                  No job link added.
                </p>
              )}
            </div>
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
