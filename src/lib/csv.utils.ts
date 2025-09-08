import type { Application as PrismaApplication } from "@prisma/client";
import { formatDate } from "./date.utils";

export const prepareApplicationsForCsv = (
  applications: PrismaApplication[],
) => {
  return applications.map((application) => {
    const {
      id,
      UserId,
      resumeUrl,
      appliedAt,
      updatedAt,
      interviewDate,
      pinned,
      ...restOfData
    } = application;

    return {
      ...restOfData,
      interviewDate: interviewDate
        ? formatDate(interviewDate, "dd/MM/yyyy HH:mm")
        : "",
      appliedAt: appliedAt ? formatDate(appliedAt) : "",
      updatedAt: updatedAt ? formatDate(updatedAt) : "",
    };
  });
};
