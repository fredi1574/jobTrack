"use client";
import type { Application as PrismaApplication } from "@prisma/client";
import { useEffect, useState } from "react";
import ApplicationNumbers from "./statistics/ApplicationNumbers";
import ApplicationsByCompany from "./statistics/ApplicationsByCompany";
import ApplicationsByDate from "./statistics/ApplicationsByDate";
import ApplicationsByPosition from "./statistics/ApplicationsByPosition";
import LocationDistribution from "./statistics/LocationDistribution";
import StatusDistribution from "./statistics/StatusDistribution";

export default function StatisticsClient({
  initialApplications,
}: {
  initialApplications: PrismaApplication[];
}) {
  const [applications, setApplications] =
    useState<PrismaApplication[]>(initialApplications);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  return (
    <div className="mx-auto my-4 w-3/4 p-4 md:p-6 lg:p-10">
      <ApplicationNumbers applications={applications} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <StatusDistribution applications={applications} />
        <LocationDistribution applications={applications} />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <ApplicationsByPosition applications={applications} />
        <ApplicationsByCompany applications={applications} />
        <ApplicationsByDate applications={applications} />
      </div>
    </div>
  );
}
