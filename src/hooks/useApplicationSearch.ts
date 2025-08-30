import { useState, useMemo } from "react";
import type { Application as PrismaApplication } from "@prisma/client";

export const useApplicationSearch = (
  applications: PrismaApplication[],
  initialSearchTerm: string = "",
) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredApplications = useMemo(() => {
    if (!searchTerm) {
      return applications;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return applications.filter(
      (application) =>
        application.company.toLowerCase().includes(lowerCaseSearchTerm) ||
        application.position.toLowerCase().includes(lowerCaseSearchTerm) ||
        application.location.toLowerCase().includes(lowerCaseSearchTerm),
    );
  }, [applications, searchTerm]);

  return { searchTerm, setSearchTerm, filteredApplications };
};
