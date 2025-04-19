"use client";
import { removeResume, updateApplicationStatus } from "@/app/actions";
import {
  Check,
  ClipboardList,
  Download,
  FileText,
  LinkIcon,
  Pencil,
  Trash,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const statusColors = {
  applied:
    "bg-sky-100 text-sky-500 hover:bg-sky-200 hover:text-sky-600 border border-sky-300",
  assessment:
    "bg-yellow-100 text-yellow-500 hover:bg-yellow-200 hover:text-yellow-600 border border-yellow-300",
  interview:
    "bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600 border border-purple-300",
  offer:
    "bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600 border border-green-300",
  rejected:
    "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 border border-red-300",
};

const possibleStatuses = [
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
];

export default function ApplicationAccordionItem({
  application,
  onDelete,
  onEdit,
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const formattedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString("en-IL")
    : "N/A";

  const statusColor =
    statusColors[application.status.toLowerCase()] ||
    "bg-gray-100 text-gray-500";

  const handleEditClick = (event) => {
    event.stopPropagation();
    onEdit(application);
  };

  const handleDeleteClick = () => {
    onDelete(application.id);
  };

  const handleStatusChange = (newStatus) => {
    startTransition(async () => {
      try {
        const result = await updateApplicationStatus(application.id, newStatus);
        if (result?.success) {
          toast.success(`Status updated to ${newStatus}`);
          router.refresh();
        } else {
          toast.error(result?.error || "Failed to update status.");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status.");
      }
    });
  };

  const handleDeleteResumeClick = () => {
    removeResume(application.id);
  };

  return (
    <AccordionItem value={application.id}>
      <AccordionTrigger
        className={`flex w-full items-center justify-between gap-2 rounded-none px-4 py-3 text-sm hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50 ${
          application.status.toLowerCase() === "offer"
            ? "bg-green-50"
            : application.status.toLowerCase() === "rejected"
              ? "bg-red-50 text-gray-400 line-through opacity-70 dark:text-gray-600"
              : ""
        }`}
      >
        {/* Main content div */}
        <div className="flex flex-1 flex-col items-start gap-1 overflow-hidden sm:flex-row sm:items-center sm:gap-4">
          <div className="flex w-full flex-col sm:w-2/5 sm:flex-row sm:gap-4">
            <span className="w-full truncate font-semibold text-gray-900 sm:w-1/2 dark:text-gray-100">
              {application.company}
            </span>
            <span className="w-full truncate text-gray-700 sm:w-1/2 dark:text-gray-300">
              {application.position}
            </span>
          </div>

          <span className="hidden w-1/6 truncate text-gray-500 sm:inline-block dark:text-gray-400">
            {application.location}
          </span>
          <span className="hidden w-1/6 truncate text-gray-500 sm:inline-block dark:text-gray-400">
            {formattedDate}
          </span>

          {/* Status Dropdown */}
          <div
            className="mt-1 w-auto sm:mt-0 sm:w-1/6"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`${statusColor} w-full cursor-pointer rounded-lg px-2 transition-colors`}
              >
                {application.status}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-sky-50 p-2">
                <div className={`flex flex-row flex-wrap`}>
                  {possibleStatuses.map((statusOption) => (
                    <DropdownMenuItem
                      key={statusOption}
                      disabled={
                        isPending || application.status === statusOption
                      }
                      onSelect={() => handleStatusChange(statusOption)}
                      className={`flex items-center justify-between ${statusColors[statusOption.toLowerCase()]} mx-0.5 h-5 cursor-pointer rounded-lg px-2 transition-colors`}
                    >
                      {statusOption}
                      {application.status === statusOption && (
                        <Check className="ml-2 size-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hidden w-auto shrink-0 text-indigo-600 hover:text-indigo-900 sm:inline-block dark:text-indigo-400 dark:hover:text-indigo-300"
              title={application.url}
            >
              <LinkIcon className="size-4" />
            </a>
          )}
          {!application.url && (
            <span
              className="hidden w-auto shrink-0 sm:inline-block"
              aria-hidden="true"
            >
              <div className="size-4" />
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 pl-1 sm:gap-3 sm:pl-2">
          <Pencil
            onClick={handleEditClick}
            className="size-4 cursor-pointer text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Edit Application"
          />
          <Trash2
            onClick={handleDeleteClick}
            className="size-4 cursor-pointer text-gray-500 hover:text-red-600 dark:hover:text-red-400"
            aria-label="Delete Application"
          />
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={`px-0 pt-0 pb-0 text-sm ${
          application.status.toLowerCase() === "rejected"
            ? "bg-red-50/50 text-gray-600"
            : application.status.toLowerCase() === "offer"
              ? "bg-green-50/50 text-gray-600"
              : "bg-gray-50/50 text-gray-600 dark:bg-gray-800/20 dark:text-gray-300"
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

            {application.url && (
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <LinkIcon className="size-4" />
                  Job Link
                </h4>
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {application.url}
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleEditClick}
              className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <Pencil className="size-3" />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
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
