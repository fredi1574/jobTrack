export default function NoJobApplications() {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h2 className="mt-2 text-xl font-medium text-gray-700 dark:text-gray-300">
        No applications yet!
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by adding your first job application.
      </p>
    </div>
  );
}
