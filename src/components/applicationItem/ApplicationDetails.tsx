import { removeResume } from "@/app/actions/application";
import { Application as PrismaApplication } from "@prisma/client";
import { format, formatDuration, intervalToDuration, isToday } from "date-fns";
import {
  Calendar,
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
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
      </div>
      <div className="flex flex-col gap-4">
        {status === "Interview" && interviewDate && (
          <div className="bg-card rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-700">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <Calendar className="size-4" />
              Interview Details
            </h4>
            <div className="pl-1 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                {format(new Date(interviewDate), "d/M/y")}
                {isToday(new Date(interviewDate)) && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {" (Today)"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                {format(new Date(interviewDate), "HH:mm")}
                {isToday(new Date(interviewDate)) && (
                  <p className="text-red-600 dark:text-red-400">
                    (
                    {formatDuration(
                      intervalToDuration({
                        start: new Date(),
                        end: new Date(interviewDate),
                      }),
                      { format: ["hours", "minutes"] },
                    )}{" "}
                    remaining)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {salary && (
          <div className="bg-card rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-700">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <DollarSign className="size-4" />
              Salary
            </h4>
            <p className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
              ₪{salary.toLocaleString("en-IL")}{" "}
            </p>
          </div>
        )}
        <div className="bg-card rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-700">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <FileText className="size-4" />
              <span>Resume</span>
            </div>
            {resumeUrl ? (
              <div className="flex items-center justify-between">
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
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <LinkIcon className="size-4" />
              <span>Job Link</span>
            </div>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
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
