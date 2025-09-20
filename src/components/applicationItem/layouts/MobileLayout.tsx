"use client";

import { STATUS_ICONS } from "@/lib/constants";
import { Application as PrismaApplication } from "@prisma/client";
import { Pin } from "lucide-react";
import InterviewTooltip from "../tooltips/InterviewTooltip";
import NoResponseWarningTooltip from "../tooltips/NoResponseWarningTooltip";

interface MobileLayoutProps {
  application: PrismaApplication;
  handlePinClick: (event: React.MouseEvent) => void;
  showNoResponseWarning: boolean;
  daysSinceLastStatusChange: number;
}

export default function MobileLayout({
  application,
  handlePinClick,
  showNoResponseWarning,
  daysSinceLastStatusChange,
}: MobileLayoutProps) {
  return (
    <div className="flex w-full items-center justify-between sm:hidden">
      <div className="flex min-w-0 items-center">
        <Pin
          onClick={handlePinClick}
          className={`mr-4 size-4 shrink-0 cursor-pointer ${
            application.pinned
              ? "rotate-45 fill-blue-500 text-blue-500"
              : "text-gray-500"
          } hover:text-blue-500 dark:hover:text-blue-400`}
          aria-label="Pin Application"
        />
        <div className="flex flex-col">
          <span className="flex items-center gap-1 break-all">
            {application.company}
          </span>
          <span className="text-sm break-all text-gray-600 dark:text-gray-400">
            {application.position}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        {application.status === "Interview" && application.interviewDate ? (
          <InterviewTooltip interviewDate={application.interviewDate} />
        ) : showNoResponseWarning ? (
          <NoResponseWarningTooltip
            daysSinceLastStatusChange={daysSinceLastStatusChange}
            applicationId={application.id}
          />
        ) : (
          <div className="mr-2 h-4 w-6" />
        )}
        {STATUS_ICONS[application.status.toLowerCase()]}
      </div>
    </div>
  );
}
