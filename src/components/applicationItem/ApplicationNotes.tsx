import {
  ClipboardList,
  DollarSign,
  NotebookPen,
  LinkIcon,
  PiggyBank,
} from "lucide-react";
import { Application as PrismaApplication } from "@prisma/client";

interface ApplicationNotesProps {
  notes?: string | null;
  salary?: number | null;
}

export default function ApplicationNotes({
  notes,
  salary,
}: ApplicationNotesProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
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
          <p className="pl-1 text-gray-500 italic dark:text-gray-400">
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
