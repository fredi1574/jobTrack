import { LinkIcon } from "lucide-react";
import React from "react";

interface ApplicationURLProps {
  applicationUrl: string | null | undefined;
}

export default function ApplicationURL({
  applicationUrl,
}: ApplicationURLProps): React.ReactElement | null {
  if (applicationUrl) {
    return (
      <a
        href={applicationUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
          event.stopPropagation()
        }
        className="hidden w-auto shrink-0 text-indigo-600 hover:text-indigo-900 sm:inline-block dark:text-indigo-400 dark:hover:text-indigo-300"
        title={applicationUrl}
      >
        <LinkIcon className="size-4" />
      </a>
    );
  } else
    return (
      <div
        className="hidden w-auto shrink-0 sm:inline-block"
        aria-hidden="true"
      >
        <div className="size-4" />
      </div>
    );
}
