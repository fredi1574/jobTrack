import { Application as PrismaApplication } from "@prisma/client";
import { format, formatDuration, intervalToDuration, isToday } from "date-fns";
import { Calendar, Clock, DollarSign, NotebookPen } from "lucide-react";

interface ApplicationNotesProps {
  application: PrismaApplication;
}

export default function ApplicationNotes({
  application,
}: ApplicationNotesProps) {
  const { notes, salary, status, interviewDate } = application;
  return (
    <div className="grid grid-cols-1 gap-4">
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
      <div className="bg-card rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-700">
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
    </div>
  );
}
