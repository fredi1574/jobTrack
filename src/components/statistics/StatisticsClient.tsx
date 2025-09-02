"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Application as PrismaApplication } from "@prisma/client";
import { useMemo, useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ApplicationNumbers from "./ApplicationNumbers";
import ApplicationsByCompany from "./ApplicationsByCompany";
import ApplicationsByDate from "./ApplicationsByDate";
import ApplicationsByPosition from "./ApplicationsByPosition";
import { ApplicationsBySource } from "./ApplicationsBySource";
import LocationDistribution from "./LocationDistribution";
import StatusDistribution from "./StatusDistribution";

export default function StatisticsClient({
  initialApplications,
  applicationsBySource,
}: {
  initialApplications: PrismaApplication[];
  applicationsBySource: { source: string; count: number }[];
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
    <div className="mx-auto p-4 md:p-6 lg:p-10">
      {/* --- Header and Filters --- */}
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="mb-4 text-2xl font-bold md:mb-0">Statistics</h1>
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center md:w-auto">
          {/* Status Filter */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Label htmlFor="status-filter" className={undefined}>
              Status
            </Label>
            <Select onValueChange={setStatusFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status} className={undefined}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Date Range Filter */}
          <div className="flex w-full items-center gap-2">
            <Label htmlFor="date-range-filter" className="w-24 md:w-auto">
              Date Range
            </Label>
            <Select onValueChange={setDateRangeFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent className={undefined}>
                <SelectItem value="all" className={undefined}>
                  All Time
                </SelectItem>
                <SelectItem value="7" className={undefined}>
                  Last 7 Days
                </SelectItem>
                <SelectItem value="30" className={undefined}>
                  Last 30 Days
                </SelectItem>
                <SelectItem value="90" className={undefined}>
                  Last 90 Days
                </SelectItem>
                <SelectItem value="180" className={undefined}>
                  Last 180 Days
                </SelectItem>
                <SelectItem value="365" className={undefined}>
                  Last 365 Days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <ApplicationNumbers applications={filteredApplications} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <StatusDistribution applications={filteredApplications} />
          </CardContent>
        </Card>
        <Card className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>Applications by Date</CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <ApplicationsByDate applications={filteredApplications} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>
              Applications by Position
            </CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <ApplicationsByPosition applications={filteredApplications} />
          </CardContent>
        </Card>
        <Card className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>Applications by Company</CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <ApplicationsByCompany applications={filteredApplications} />
          </CardContent>
        </Card>

        <Card className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>
              Applications by Location
            </CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <LocationDistribution applications={filteredApplications} />
          </CardContent>
        </Card>

        <Card className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>Applications by Source</CardTitle>
          </CardHeader>
          <CardContent className={undefined}>
            <ApplicationsBySource data={applicationsBySource} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
