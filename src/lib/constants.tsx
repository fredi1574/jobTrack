import { Award, BadgeX, ClipboardList, MailCheck, Users } from "lucide-react";

export const POSSIBLE_APPLICATION_STATUSES = [
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
] as const;

export const STATUS_COLORS: Record<string, string> = {
  applied:
    "bg-sky-100 text-sky-500 hover:bg-sky-200 hover:text-sky-600 border border-sky-300 dark:hover:bg-sky-800/50 dark:hover:text-sky-300",
  assessment:
    "bg-yellow-100 text-yellow-500 hover:bg-yellow-200 hover:text-yellow-600 border border-yellow-300 dark:hover:bg-yellow-800/50 dark:hover:text-yellow-300",
  interview:
    "bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600 border border-purple-300 dark:hover:bg-purple-800/50 dark:hover:text-purple-300",
  offer:
    "bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600 border border-green-300 dark:hover:bg-green-800/50 dark:hover:text-green-300",
  rejected:
    "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 border border-red-300 dark:hover:bg-red-800/50 dark:hover:text-red-300",
};

export const STATUS_ICONS: Record<string, React.ReactNode> = {
  applied: <MailCheck className="size-4 text-sky-500" />,
  assessment: <ClipboardList className="size-4 text-yellow-500" />,
  interview: <Users className="size-4 text-purple-500" />,
  offer: <Award className="size-4 text-green-500" />,
  rejected: <BadgeX className="size-4 text-red-500" />,
};
