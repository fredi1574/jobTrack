export default function ApplicationInfo({ application }) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="w-full font-semibold text-gray-900 sm:w-1/2 dark:text-gray-100">
        {application.company}
      </span>
      <span className="w-full text-gray-700 sm:w-1/2 dark:text-gray-300">
        {application.position}
      </span>

      <span className="hidden w-1/6 text-gray-500 sm:inline-block dark:text-gray-400">
        {application.location}
      </span>
      <span className="hidden w-1/6 text-gray-500 sm:inline-block dark:text-gray-400">
        {application.appliedAt.toLocaleDateString("en-IL")}
      </span>
    </div>
  );
}
