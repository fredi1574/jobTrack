import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-10">
      {/* Filters Skeleton */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-44 rounded-md" />
          <Skeleton className="h-10 w-44 rounded-md" />
        </div>
      </div>

      {/* ApplicationNumbers Skeleton */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-28 rounded-lg" />
      </div>

      {/* Chart Skeletons */}
      <div className="space-y-6">
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <Skeleton className="h-80 w-full rounded-lg lg:w-1/2" />
          <Skeleton className="h-80 w-full rounded-lg lg:w-1/2" />
        </div>
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <Skeleton className="h-80 w-full rounded-lg lg:w-1/2" />
          <Skeleton className="h-80 w-full rounded-lg lg:w-1/2" />
        </div>
        <div className="flex w-full">
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
