import { Download, FileText, LinkIcon, Trash } from "lucide-react";
import { removeResume } from "@/app/actions";

interface ApplicationLinksProps {
  applicationId: string;
  resumeUrl: string | null;
  jobUrl: string | null;
}

export default function ApplicationLinks({
  applicationId,
  resumeUrl,
  jobUrl,
}: ApplicationLinksProps) {
  const handleDeleteResumeClick = () => {
    removeResume(applicationId);
  };

  return (
    <div className="bg-card h-full rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-700">
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
        {jobUrl ? (
          <a
            href={jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            {jobUrl}
          </a>
        ) : (
          <p className="text-gray-500 italic dark:text-gray-400">
            No job link added.
          </p>
        )}
      </div>
    </div>
  );
}
