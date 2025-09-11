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
    return interviewApplications
      .filter(
        (application) =>
          application.interviewDate && application.interviewDate >= new Date(),
      )
      .sort(
        (a, b) =>
          (a.interviewDate?.getTime() || 0) - (b.interviewDate?.getTime() || 0),
      );
  }, [interviewApplications]);

  const noResponseApplications = useMemo(() => {
    return applications.filter((application) => {
      const daysSinceLastStatusChange = application.lastStatusChangeDate
        ? getDaysSince(application.lastStatusChangeDate)
        : 0;
      return daysSinceLastStatusChange > 7;
    });
  }, [applications]);

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

      <h2 className="my-2 text-center text-lg font-bold">
        Upcoming interviews
      </h2>
      {upcomingInterviews.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming interviews</p>
      ) : (
        <ul className="flex-grow overflow-auto pr-1">
          {upcomingInterviews.map((application) => (
            <li
              key={application.id}
              className="my-2 flex w-full items-center justify-between rounded-md border bg-purple-100 p-4 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300"
            >
              <div>
                <p className="font-semibold break-all">
                  {application.company} - {application.position}
                </p>
                {application.interviewDate && (
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
              </div>
              <p className="text-sm">{application.location}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="my-2 text-center text-lg font-bold">
        Applications with no recent status change
      </h2>
      {noResponseApplications.length === 0 ? (
        <p className="text-center text-gray-500">
          All applications have recent status changes.
        </p>
      ) : (
        <ul className="flex-grow overflow-auto pr-1">
          {noResponseApplications.map((application) => (
            <li
              key={application.id}
              className="my-2 flex w-full items-center justify-between rounded-md border bg-red-100 p-4 text-red-800 dark:bg-red-500/20 dark:text-red-300"
            >
              <div>
                <p className="font-semibold break-all">
                  {application.company} - {application.position}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <ClockAlert className="h-3 w-3" />
                  {getDaysSince(application.lastStatusChangeDate as Date)} days
                  since last status change
                </div>
                <Button
                  onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    resetLastStatusChangeDate(application.id);
                    router.refresh();
                  }}
                  variant="ghost"
                  size="sm"
                  className="mt-1 mr-2 text-xs text-red-500"
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
              <p className="text-sm">{application.location}</p>
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
