import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-10">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-72 rounded-md" />
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full rounded-md sm:w-72" />
          <Skeleton className="h-10 w-full rounded-md sm:w-40" />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        {/* ApplicationsHeader Skeleton */}
        <div className="hidden items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 lg:flex dark:border-gray-700 dark:bg-slate-800">
          <div className="flex-1">
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="w-40">
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="w-20 text-center">
            <Skeleton className="mx-auto h-5 w-8" />
          </div>
          <div className="w-24 text-right">
            <Skeleton className="ml-auto h-5 w-16" />
          </div>
        </div>

        {/* ApplicationAccordionItem Skeletons */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-5">
              <div className="flex items-center gap-4">
                {/* ApplicationInfo skeleton */}
                <div className="flex-1 space-y-2 overflow-hidden">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>

                {/* StatusDropdown skeleton */}
                <Skeleton className="h-8 w-32 rounded-md" />

                {/* ApplicationURL skeleton */}
                <Skeleton className="h-8 w-8 rounded-full" />

                {/* ApplicationActions skeleton */}
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
