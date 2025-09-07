import { Application as PrismaApplication } from "@prisma/client";
import { Accordion } from "@radix-ui/react-accordion";
import ApplicationAccordionItem from "./applicationItem/ApplicationAccordionItem";
import ApplicationsHeader from "./ApplicationsHeader";
import NoJobApplications from "./NoJobApplications";
import { useMemo } from "react";

interface ApplicationListProps {
  applications: PrismaApplication[];
  sortColumn: keyof PrismaApplication | null;
  sortDirection: "asc" | "desc";
  handleSort: (column: keyof PrismaApplication) => void;
}

export default function ApplicationList({
  applications,
  sortColumn,
  sortDirection,
  handleSort,
}: ApplicationListProps) {
  const sortedAndPrioritizedApplications = useMemo(() => {
    const sorted = [...applications];
    sorted.sort((a, b) => {
      // Pinned applications come first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Maintain existing sort order for non-pinned applications
      return 0;
    });
    return sorted;
  }, [applications]);

  return (
    <>
      {sortedAndPrioritizedApplications.length > 0 ? (
        <div className="mx-[-1rem] shadow-lg/10 sm:mx-auto sm:w-full">
          <ApplicationsHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <Accordion type="single" collapsible className="w-full">
            {sortedAndPrioritizedApplications.map((application) => (
              <ApplicationAccordionItem
                key={application.id}
                application={application}
              />
            ))}
          </Accordion>
        </div>
      ) : (
        <NoJobApplications />
      )}
    </>
  );
}
