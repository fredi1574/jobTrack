import { format } from "date-fns";

export const getUserTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDate = (
  date: Date,
  formatString: string = "dd/MM/yyyy HH:mm",
): string => {
  return format(date, formatString);
};
