import { FolderPlus } from "lucide-react";

export default function NoJobApplications() {
  return (
    <div className="bg-secondary mt-6 rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
      <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
      <h2 className="mt-2 text-xl font-medium text-gray-700 dark:text-gray-300">
        No applications yet!
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by adding your first job application.
      </p>
    </div>
  );
}
