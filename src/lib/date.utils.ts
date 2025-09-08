import { format } from "date-fns";

export const formatDate = (
  dateString: string | Date,
  formatStr: string = "dd/MM/yyyy",
) => {
  const date = new Date(dateString);
  return format(date, formatStr);
};
