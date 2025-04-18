import { LinkIcon, Pencil, Trash2 } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const statusColors = {
  applied: "bg-sky-100 text-sky-500",
  assessment: "bg-yellow-100 text-yellow-500",
  interview: "bg-purple-100 text-purple-500",
  offer: "bg-green-100 text-green-500",
  rejected: "bg-red-100 text-red-500",
};

export default function ApplicationAccordionItem({
  application,
  onDelete,
  onEdit,
}) {
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

  return (
    <AccordionItem value={application.id}>
      <AccordionTrigger
        className={`flex w-full items-center justify-between gap-2 rounded-none px-4 py-3 text-sm hover:bg-gray-100 hover:no-underline dark:hover:bg-gray-800/50 ${
          application.status.toLowerCase() === "rejected"
            ? "bg-red-100 line-through opacity-70 dark:text-gray-600"
            : application.status.toLowerCase() === "offer"
              ? "bg-green-100"
              : ""
        }`}
      >
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
            {application.city}
          </span>
          <span className="hidden w-1/6 truncate text-gray-500 sm:inline-block dark:text-gray-400">
            {formattedDate}
          </span>

          <span
            className={`mt-1 w-auto text-center sm:mt-0 sm:w-1/6 ${statusColor} inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold`}
          >
            {application.status}
          </span>

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
        className={`px-4 pt-2 pb-4 text-sm text-gray-600 ${application.status.toLowerCase() === "rejected" ? "bg-red-50 text-red-500 line-through" : application.status.toLowerCase() === "offer" ? "bg-green-50 text-green-500" : ""}`}
      >
        {application.notes ? (
          <div>
            <h4 className="mb-1 font-semibold text-gray-700">Notes:</h4>
            <p className="whitespace-pre-wrap">{application.notes}</p>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">No notes added.</p>
        )}

        <div className="mt-4">
          <h4 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Resume:
          </h4>
          <p className="italic">
            Resume upload/link functionality not yet implemented.
          </p>
        </div>

        {application.url && (
          <div className="mt-4">
            <h4 className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Link:
            </h4>
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {application.url}
            </a>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
