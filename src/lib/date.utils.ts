import { parseISO } from "date-fns";

export const getDaysSince = (dateString: string | Date): number => {
  const date =
    typeof dateString === "string" ? parseISO(dateString) : dateString;
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
