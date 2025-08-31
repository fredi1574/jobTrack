import type { Application as PrismaApplication } from "@prisma/client";
import { formatDate } from "./date.utils";

export const prepareApplicationsForCsv = (
  applications: PrismaApplication[],
) => {
  return applications.map((application) => {
    const { id, UserId, resumeUrl, appliedAt, updatedAt, ...restOfData } =
      application;

    return {
      ...restOfData,
      appliedAt: appliedAt ? formatDate(appliedAt) : "",
      updatedAt: updatedAt ? formatDate(updatedAt) : "",
    };
  });
};
