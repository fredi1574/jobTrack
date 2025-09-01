import { ClipboardList, NotebookPen } from "lucide-react";

interface ApplicationNotesProps {
  notes: string | null;
}

export default function ApplicationNotes({ notes }: ApplicationNotesProps) {
  return (
    <div className="h-full rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        <NotebookPen className="size-4" />
        Notes
      </h4>
      {notes ? (
        <div className="pl-1 whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300">
          {notes}
        </div>
      ) : (
        <p className="pl-1 text-gray-500 italic dark:text-gray-400">
          No notes added.
        </p>
      )}
    </div>
  );
}
