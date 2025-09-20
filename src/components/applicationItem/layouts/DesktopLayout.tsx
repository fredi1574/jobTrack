'use client';

import StatusDropdown from '@/components/applicationItem/StatusDropdown';
import { Application as PrismaApplication } from '@prisma/client';
import { Pin } from 'lucide-react';
import ApplicationURL from '../ApplicationURL';
import InterviewTooltip from '../tooltips/InterviewTooltip';
import NoResponseWarningTooltip from '../tooltips/NoResponseWarningTooltip';

interface DesktopLayoutProps {
  application: PrismaApplication;
  handlePinClick: (event: React.MouseEvent) => void;
  showNoResponseWarning: boolean;
  daysSinceLastStatusChange: number;
  formattedDate: string;
}

export default function DesktopLayout({
  application,
  handlePinClick,
  showNoResponseWarning,
  daysSinceLastStatusChange,
  formattedDate,
}: DesktopLayoutProps) {
  return (
    <div className="hidden w-full flex-1 items-center justify-around gap-4 overflow-hidden sm:flex">
      <div className="flex items-center gap-1 sm:w-1/5">
        <Pin
          onClick={handlePinClick}
          className={`hover:bg-accent-foreground/10 mr-2 size-4 shrink-0 cursor-pointer rounded-full transition-colors ${
            application.pinned
              ? 'rotate-45 fill-blue-500 text-blue-500'
              : 'text-gray-500'
          } hover:text-blue-500 dark:hover:text-blue-400`}
          aria-label="Pin Application"
        />
        <span className="break-all text-gray-900 dark:text-gray-100">
          {application.company}
        </span>
      </div>
      <span className="break-all text-gray-700 sm:w-1/5 dark:text-gray-300">
        {application.position}
      </span>
      <span className="text-gray-500 sm:w-1/6 dark:text-gray-400">
        {application.location}
      </span>
      <span className="text-gray-500 sm:w-1/6 dark:text-gray-400">
        {formattedDate}
      </span>
      <div className="flex items-center justify-center sm:w-1/6">
        <StatusDropdown application={application} />
      </div>
      <div className="flex items-center">
        {application.status === 'Interview' && application.interviewDate ? (
          <InterviewTooltip interviewDate={application.interviewDate} />
        ) : showNoResponseWarning ? (
          <NoResponseWarningTooltip
            daysSinceLastStatusChange={daysSinceLastStatusChange}
            applicationId={application.id}
          />
        ) : (
          <div className="h-4 w-6" />
        )}
      </div>
      <div className="w-auto shrink-0">
        <ApplicationURL applicationUrl={application.url} />
      </div>
    </div>
  );
}
