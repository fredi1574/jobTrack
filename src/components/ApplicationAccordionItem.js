import { LinkIcon, Pencil, Trash2 } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const statusColors = {
  applied: "bg-sky-100 text-sky-500",
  interview: "bg-purple-100 text-purple-500",
  offer: "bg-green-100 text-green-500",
  rejected: "bg-red-100 text-red-500",
};

export default function ApplicationAccordionItem({ application, onDelete }) {
  const formattedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString("en-IL")
    : "N/A";

  const displayURL = application.url
    ? application.url.length > 20
      ? `${application.url.substring(0, 20)}...`
      : application.url
    : "";

  const statusColor =
    statusColors[application.status.toLowerCase()] ||
    "bg-gray-100 text-gray-500";

  const handleEditClick = () => {
    // Handle edit button click here
    console.log("Edit button clicked for application:", application);
  };

  const handleDeleteClick = () => {
    onDelete(application.id);
  };

  return (
    <AccordionItem value={application.id}>
      <AccordionTrigger
        className={`flex w-full items-center rounded-none pr-4 hover:bg-gray-100 hover:no-underline ${application.status.toLowerCase() === "rejected" || application.status.toLowerCase() === "offer" ? statusColor : ""}`}
      >
        <div className="flex flex-1 items-center gap-4 overflow-hidden px-4">
          <span className="w-1/5 truncate font-medium text-gray-900">
            {application.company}
          </span>
          <span className="w-1/5 truncate text-gray-700">
            {application.position}
          </span>
          <span className="w-1/6 truncate text-gray-700">
            {application.city}
          </span>
          <span className="w-1/6 truncate text-gray-700">{formattedDate}</span>
          <span
            className={`text-center ${statusColor} inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold`}
          >
            {application.status}
          </span>
          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-auto shrink-0 text-indigo-600 hover:text-indigo-900"
              title={application.url}
            >
              <LinkIcon className="size-4" />
            </a>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3 pl-2">
          <Pencil
            onClick={handleEditClick}
            className="size-4 cursor-pointer text-gray-500 hover:text-blue-600"
            aria-label="Edit application"
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
          <h4 className="mb-1 font-semibold text-gray-700">Resume:</h4>
          <p className="italic">
            Resume upload/link functionality not yet implemented.
          </p>
        </div>
        {application.url && (
          <div className="mt-4">
            <h4 className="mb-1 font-semibold text-gray-700">URL:</h4>
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-800"
            >
              {application.url}
            </a>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
