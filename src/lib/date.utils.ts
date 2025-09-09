import { format } from "date-fns";

export const formatDate = (
  dateString: string | Date,
  formatStr: string = "dd/MM/yyyy",
) => {
  const date = new Date(dateString);
  return format(date, formatStr);
};

export const getDaysSince = (dateString: string | Date): number => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
