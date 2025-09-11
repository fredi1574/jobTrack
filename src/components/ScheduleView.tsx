import { resetLastStatusChangeDate } from "@/app/actions/application";
import { Calendar, DayModifiers } from "@/components/ui/calendar";
import { getDaysSince } from "@/lib/date.utils";
import type { Application as PrismaApplication } from "@prisma/client";
import { format, formatDuration, intervalToDuration, isToday } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  ClockAlert,
  Timer,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DeleteApplicationModal from "./modal/DeleteApplicationModal";
import { Button } from "./ui/button";

export default function ScheduleView({
  applications,
}: {
  applications: PrismaApplication[];
}) {
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApplication, setDeletingApplication] =
    useState<PrismaApplication | null>(null);

  const handleDeleteClick = (app: PrismaApplication) => {
    setDeletingApplication(app);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingApplication(null);
  };

  const interviewApplications = useMemo(() => {
    return applications.filter((application) => {
      return application.status === "Interview" && application.interviewDate;
    });
  }, [applications]);

  const interviewDates = useMemo(() => {
    return interviewApplications.map((application) => {
      return application.interviewDate as Date;
    });
  }, [interviewApplications]);

  const upcomingInterviews = useMemo(() => {
    return applications
      .filter(
        (application) =>
          application.status === "Interview" &&
          application.interviewDate &&
          application.interviewDate >= new Date(),
      )
      .sort(
        (a, b) =>
          (a.interviewDate?.getTime() || 0) - (b.interviewDate?.getTime() || 0),
      );
  }, [applications]);

  const noResponseApplications = useMemo(() => {
    return applications.filter((application) => {
      const daysSinceLastStatusChange = application.lastStatusChangeDate
        ? getDaysSince(application.lastStatusChangeDate)
        : 0;
      return daysSinceLastStatusChange > 7;
    });
  }, [applications]);

  const mergedApplications = useMemo(() => {
    const combined = [...upcomingInterviews, ...noResponseApplications];
    const uniqueApplications = Array.from(
      new Map(combined.map((app) => [app.id, app])).values(),
    );

    return uniqueApplications.sort((a, b) => {
      const dateA = a.interviewDate || a.lastStatusChangeDate;
      const dateB = b.interviewDate || b.lastStatusChangeDate;

      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime();
      }
      if (dateA) return -1;
      if (dateB) return 1;

      return (
        a.company.localeCompare(b.company) ||
        a.position.localeCompare(b.position)
      );
    });
  }, [upcomingInterviews, noResponseApplications]);

  return (
    <div className="mx-2 flex h-[95dvh] flex-col">
      <Calendar
        mode="single"
        className="w-full rounded-md border"
        selected={undefined}
        onSelect={undefined}
        components={{
          Day: ({
            date,
            modifiers,
            ...props
          }: {
            date: Date;
            modifiers: DayModifiers;
            [key: string]: any;
          }) => {
            const hasInterview = modifiers.interview;
            return (
              <td {...props} className={`relative ${props.className}`}>
                {props.children}
                {hasInterview && (
                  <span className="absolute bottom-1 left-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-purple-500" />
                )}
              </td>
            );
          },
        }}
        modifiers={{
          interview: interviewDates,
        }}
        classNames={undefined}
        formatters={undefined}
      />

      <h2 className="my-2 text-center text-lg font-bold">Updates</h2>
      {mergedApplications.length === 0 ? (
        <p className="text-center text-gray-500">No updates to show.</p>
      ) : (
        <ul className="flex-grow overflow-auto pr-1">
          {mergedApplications.map((application) => (
            <li
              key={application.id}
              className={`my-2 flex w-full items-center justify-between rounded-md border p-4 ${
                application.status === "Interview"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300"
                  : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300"
              }`}
            >
              <div>
                <p className="font-semibold break-all">
                  {application.company} - {application.position}
                </p>
                {application.status === "Interview" &&
                  application.interviewDate && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(application.interviewDate), "d/M/y")}
                        {isToday(new Date(application.interviewDate)) && (
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {" (Today)"}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {format(new Date(application.interviewDate), "HH:mm")}
                        {isToday(new Date(application.interviewDate)) &&
                          new Date(application.interviewDate) > new Date() && (
                            <p className="text-red-600 dark:text-red-400">
                              (
                              {formatDuration(
                                intervalToDuration({
                                  start: new Date(),
                                  end: new Date(application.interviewDate),
                                }),
                                { format: ["hours", "minutes"] },
                              )}{" "}
                              remaining)
                            </p>
                          )}
                      </div>
                    </div>
                  )}
                {application.status !== "Interview" &&
                  application.lastStatusChangeDate && (
                    <div className="flex items-center gap-1 text-xs">
                      <ClockAlert className="h-3 w-3" />
                      {getDaysSince(
                        application.lastStatusChangeDate as Date,
                      )}{" "}
                      days since last status change
                    </div>
                  )}
                {application.status !== "Interview" && (
                  <div className="mt-2 flex gap-2 sm:flex-row sm:gap-2">
                    <Button
                      onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        resetLastStatusChangeDate(application.id);
                        router.refresh();
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-500"
                    >
                      <Timer className="h-4 w-4" />
                      Wait More
                    </Button>
                    <Button
                      variant="destructive"
                      size={"sm"}
                      onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        handleDeleteClick(application);
                      }}
                      className="text-xs"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs break-all">{application.location}</p>
            </li>
          ))}
        </ul>
      )}
      <DeleteApplicationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        applicationId={deletingApplication?.id || ""}
      />
    </div>
  );
}
