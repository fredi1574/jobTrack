import { LinkIcon } from "lucide-react";

export default function ApplicationURL({ applicationUrl }) {
  if (applicationUrl) {
    return (
      <a
        href={applicationUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="hidden w-auto shrink-0 text-indigo-600 hover:text-indigo-900 sm:inline-block dark:text-indigo-400 dark:hover:text-indigo-300"
        title={applicationUrl}
      >
        <LinkIcon className="size-4" />
      </a>
    );
  } else return <span className="hidden w-auto shrink-0 sm:inline-block" />;
}
