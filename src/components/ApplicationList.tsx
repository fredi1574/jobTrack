"use client";
import { Application as PrismaApplication } from "@prisma/client";
import { Accordion } from "@radix-ui/react-accordion";
import ApplicationAccordionItem from "./applicationItem/ApplicationAccordionItem";
import ApplicationsHeader from "./ApplicationsHeader";
import NoJobApplications from "./NoJobApplications";
import { useMemo } from "react";
import { motion } from "motion/react";

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-[-1rem] shadow-lg/10 sm:mx-auto sm:w-full"
        >
          <ApplicationsHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <Accordion type="single" collapsible className="w-full">
            {sortedAndPrioritizedApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <ApplicationAccordionItem application={application} />
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      ) : (
        <NoJobApplications />
      )}
    </>
  );
}
