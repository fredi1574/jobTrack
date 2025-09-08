import { Calendar, DayModifiers } from "@/components/ui/calendar";
import type { Application as PrismaApplication } from "@prisma/client";
import { format, formatDuration, intervalToDuration, isToday } from "date-fns";
import { Calendar1, Clock } from "lucide-react";
import { useMemo, useState } from "react";

export default function ScheduleView({
  applications,
}: {
  applications: PrismaApplication[];
}) {
  const [date, setDate] = useState<Date | null>(new Date());

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

  return (
    <div className="mx-2 flex h-[95dvh] flex-col">
      <Calendar
        mode="single"
        className="w-full rounded-md border"
        selected={date}
        onSelect={setDate}
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
                      <Calendar1 className="h-3 w-3" />
                      {format(application.interviewDate, "d/M/y")}
                      {isToday(application.interviewDate) && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          {" (Today)"}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {format(application.interviewDate, "HH:mm")}
                      {isToday(application.interviewDate) &&
                        application.interviewDate > new Date() && (
                          <p className="text-red-600 dark:text-red-400">
                            (
                            {formatDuration(
                              intervalToDuration({
                                start: new Date(),
                                end: application.interviewDate,
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
    </div>
  );
}
