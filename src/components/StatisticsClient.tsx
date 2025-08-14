"use client";
import type { Application as PrismaApplication } from "@prisma/client";
import { useMemo, useState } from "react";
import ApplicationNumbers from "./statistics/ApplicationNumbers";
import ApplicationsByCompany from "./statistics/ApplicationsByCompany";
import ApplicationsByDate from "./statistics/ApplicationsByDate";
import ApplicationsByPosition from "./statistics/ApplicationsByPosition";
import LocationDistribution from "./statistics/LocationDistribution";
import StatusDistribution from "./statistics/StatusDistribution";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function StatisticsClient({
  initialApplications,
}: {
  initialApplications: PrismaApplication[];
}) {
  // State for the filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");

  // Get unique statuses for the filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(initialApplications.map((app) => app.status));
    return ["all", ...Array.from(statuses)];
  }, [initialApplications]);

  const filteredApplications = useMemo(() => {
    let filtered = initialApplications;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Filter by date range
    if (dateRangeFilter !== "all") {
      const days = parseInt(dateRangeFilter, 10);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      filtered = filtered.filter((app) => {
        if (!app.appliedAt) return false;
        return new Date(app.appliedAt) >= cutoffDate;
      });
    }

    return filtered;
  }, [initialApplications, statusFilter, dateRangeFilter]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:justify-end">
        {/* Filters */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="" htmlFor="status-filter">
              Status
            </Label>
            <Select
              onValueChange={(value: string) => setStatusFilter(value)}
              defaultValue="all"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status..." />
              </SelectTrigger>
              <SelectContent className="">
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} className="" value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="" htmlFor="date-range-filter">
              Date Range
            </Label>
            <Select
              onValueChange={(value: string) => setDateRangeFilter(value)}
              defaultValue="all"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date..." />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem className="" value="all">
                  All Time
                </SelectItem>
                <SelectItem className="" value="7">
                  Last 7 Days
                </SelectItem>
                <SelectItem className="" value="30">
                  Last 30 Days
                </SelectItem>
                <SelectItem className="" value="90">
                  Last 90 Days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <ApplicationNumbers applications={filteredApplications} />
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <StatusDistribution applications={filteredApplications} />
        <LocationDistribution applications={filteredApplications} />
      </div>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <ApplicationsByPosition applications={filteredApplications} />
        <ApplicationsByDate applications={filteredApplications} />
      </div>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <ApplicationsByCompany applications={filteredApplications} />
      </div>
    </div>
  );
}
