import { LinkIcon } from "lucide-react";

interface ApplicationJobLinkProps {
  url: string | null;
}

export default function ApplicationJobLink({ url }: ApplicationJobLinkProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        <LinkIcon className="size-4" />
        Job Link
      </h4>
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
  );
}
