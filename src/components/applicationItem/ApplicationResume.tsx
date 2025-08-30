import { Download, FileText, Trash } from "lucide-react";
import { removeResume } from "@/app/actions";

interface ApplicationResumeProps {
  resumeUrl: string | null;
  applicationId: string;
}

export default function ApplicationResume({
  resumeUrl,
  applicationId,
}: ApplicationResumeProps) {
  const handleDeleteResumeClick = () => {
    removeResume(applicationId);
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        <FileText className="size-4" />
        Resume
      </h4>
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
  );
}
