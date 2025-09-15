import { removeResume } from "@/app/actions/application";
import { Application as PrismaApplication } from "@prisma/client";
import { formatDuration, intervalToDuration, isToday } from "date-fns";
import {
  Calendar,
  CalendarClock,
  Clock,
  DollarSign,
  Download,
  FileText,
  LinkIcon,
  NotebookPen,
  Trash,
} from "lucide-react";

interface ApplicationDetailsProps {
  application: PrismaApplication;
}

export default function ApplicationDetails({
  application,
}: ApplicationDetailsProps) {
  const { id, notes, salary, status, interviewDate, resumeUrl, url } =
    application;

  const handleDeleteResumeClick = () => {
    removeResume(id);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card h-full rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-700">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          <NotebookPen className="size-4" />
          Notes
        </h4>
        {notes ? (
          <div className="pl-1 break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {notes}
          </div>
        ) : (
          <p className="pl-1 text-sm text-gray-500 italic dark:text-gray-400">
            No notes added.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {status === "Interview" && interviewDate && (
          <div className="bg-card flex items-center justify-between rounded-lg border border-gray-100 p-2 shadow-sm dark:border-gray-700">
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <CalendarClock className="size-4" />
              Interview Details
            </h4>
            <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
              <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>
                  {(() => {
                    const date = new Date(interviewDate);
                    const day = String(date.getUTCDate()).padStart(2, "0");
                    const month = String(date.getUTCMonth() + 1).padStart(
                      2,
                      "0",
                    );
                    const year = date.getUTCFullYear();
                    return `${day}/${month}/${year}`;
                  })()}
                </span>
                {isToday(new Date(interviewDate)) && (
                  <span className="ml-1 text-red-600 dark:text-red-400">
                    (Today)
                  </span>
                )}
              </div>
              <span className="text-gray-500">at</span>
              <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span>
                  {(() => {
                    const date = new Date(interviewDate);
                    const hours = String(date.getUTCHours()).padStart(2, "0");
                    const minutes = String(date.getUTCMinutes()).padStart(
                      2,
                      "0",
                    );
                    return `${hours}:${minutes}`;
                  })()}
                </span>
              </div>
              {isToday(new Date(interviewDate)) &&
                new Date(interviewDate) > new Date() && (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    (
                    {formatDuration(
                      intervalToDuration({
                        start: new Date(),
                        end: new Date(interviewDate),
                      }),
                      { format: ["hours", "minutes"] },
                    )}
                    &nbsp;remaining)
                  </div>
                )}
            </div>
          </div>
        )}
        {salary && (
          <div className="bg-card flex items-center justify-between rounded-lg border border-gray-100 p-2 shadow-sm dark:border-gray-700">
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <DollarSign className="size-4" />
              Salary
            </h4>
            <p className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
              ₪{salary.toLocaleString("en-IL")}{" "}
            </p>
          </div>
        )}
        <div className="bg-card flex flex-col gap-2 rounded-lg border border-gray-100 p-2 shadow-sm dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <FileText className="size-4" />
              <span>Resume</span>
            </div>
            {resumeUrl ? (
              <div className="flex items-center">
                <a
                  href={resumeUrl}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <LinkIcon className="size-4" />
              <span>Job Link</span>
            </div>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {url}
              </a>
            ) : (
              <p className="text-gray-500 italic dark:text-gray-400">
                No job link added.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
