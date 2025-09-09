import {
  BadgeX,
  ClipboardList,
  Handshake,
  MailCheck,
  MessagesSquare,
} from "lucide-react";

export const POSSIBLE_APPLICATION_STATUSES = [
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
] as const;

export const STATUS_COLORS: Record<string, string> = {
  applied:
    "bg-sky-200 text-sky-500 hover:bg-sky-300 hover:text-sky-600 border border-sky-300 dark:text-sky-400 dark:bg-sky-900 dark:hover:bg-sky-700 dark:hover:text-sky-300 group-hover:bg-sky-300/80 dark:group-hover:bg-sky-800",
  assessment:
    "bg-yellow-200 text-yellow-500 hover:bg-yellow-300 hover:text-yellow-600 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-400 dark:hover:bg-yellow-700 dark:hover:text-yellow-300 group-hover:bg-yellow-300/80 dark:group-hover:bg-yellow-800",
  interview:
    "bg-purple-200 text-purple-500 hover:bg-purple-300 hover:text-purple-600 border border-purple-300 dark:bg-purple-900 dark:text-purple-400 dark:hover:bg-purple-700 dark:hover:text-purple-300 group-hover:bg-purple-300/80 dark:group-hover:bg-purple-800",
  offer:
    "bg-green-200 text-green-500 hover:bg-green-300 hover:text-green-600 border border-green-300 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-700 dark:hover:text-green-300 group-hover:bg-green-300/80 dark:group-hover:bg-green-800",
  rejected:
    "bg-red-200 text-red-500 hover:bg-red-300 hover:text-red-600 border border-red-300 dark:text-red-400 dark:bg-red-900 dark:hover:bg-red-700 dark:hover:text-red-300 group-hover:bg-red-300/80 dark:group-hover:bg-red-800",
};

export const STATUS_ICONS: Record<string, React.ReactNode> = {
  applied: <MailCheck className="mr-1 size-5 text-sky-500 dark:text-sky-400" />,
  assessment: (
    <ClipboardList className="mr-1 size-5 text-yellow-500 dark:text-yellow-400" />
  ),
  interview: (
    <MessagesSquare className="mr-1 size-5 text-purple-500 dark:text-purple-400" />
  ),
  offer: (
    <Handshake className="mr-1 size-5 text-green-500 dark:text-green-400" />
  ),
  rejected: <BadgeX className="mr-1 size-5 text-red-500 dark:text-red-400" />,
};

export const STATUS_CARD_COLORS: Record<string, string> = {
  total:
    "bg-neutral-50 text-neutral-600 dark:text-neutral-400 dark:bg-neutral-800",
  applied: "bg-sky-200 text-sky-500 dark:text-sky-400 dark:bg-sky-800",
  assessment:
    "bg-yellow-200 text-yellow-500 dark:text-yellow-400 dark:bg-yellow-600",
  interview:
    "bg-purple-200 text-purple-500 dark:text-purple-400 dark:bg-purple-800",
  offer: "bg-green-200 text-green-500 dark:text-green-400 dark:bg-green-800",
  rejected: "bg-red-200 text-red-500 dark:text-red-400 dark:bg-red-800",
};

export const TOAST_BACKGROUND_COLORS: Record<string, string> = {
  applied: "oklch(0.83 0.10 230)",
  assessment: "oklch(0.91 0.17 98)",
  interview: "oklch(0.83 0.11 306)",
  offer: "oklch(0.87 0.14 154)",
  rejected: "oklch(0.81 0.10 20)",
};

export const TOAST_TEXT_COLORS: Record<string, string> = {
  applied: "oklch(0.50 0.12 243)",
  assessment: "oklch(0.55 0.12 66)",
  interview: "oklch(0.50 0.24 302)",
  offer: "oklch(0.53 0.14 150)",
  rejected: "oklch(0.51 0.19 28)",
};
