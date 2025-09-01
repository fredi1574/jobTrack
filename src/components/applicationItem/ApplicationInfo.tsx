import type { Application as PrismaApplication } from "@prisma/client";

interface ApplicationInfoProps {
  application: PrismaApplication;
}

export default function ApplicationInfo({
  application,
}: ApplicationInfoProps): React.ReactElement | null {
  const formattedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString("en-IL")
    : "N/A";

  return (
    <>
      <div className="flex w-full flex-col sm:w-2/5 sm:flex-row sm:gap-4">
        <span className="w-full font-semibold break-all text-gray-900 sm:w-1/2 dark:text-gray-100">
          {application.company}
        </span>
        <span className="w-full break-all text-gray-700 sm:w-1/2 dark:text-gray-300">
          {application.position}
        </span>
      </div>

      <span className="hidden w-1/6 truncate text-gray-500 sm:inline-block dark:text-gray-400">
        {application.location}
      </span>

      <span className="hidden w-1/6 truncate text-gray-500 sm:inline-block dark:text-gray-400">
        {formattedDate}
      </span>
    </>
  );
}
