import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get status-based styling for AccordionItem and Trigger
export const getStatusStyling = (status: string) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case "applied":
      return {
        background: "bg-sky-50 dark:bg-sky-900/20",
        border: "border-l-4 border-l-sky-500 dark:border-l-sky-800",
        hover: "hover:bg-sky-100 dark:hover:bg-sky-900/30",
      };
    case "assessment":
      return {
        background: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-l-4 border-l-yellow-500 dark:border-l-yellow-800",
        hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
      };
    case "interview":
      return {
        background: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-l-4 border-l-purple-500 dark:border-l-purple-800",
        hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      };
    case "offer":
      return {
        background: "bg-green-50 dark:bg-green-900/20",
        border: "border-l-4 border-l-green-500 dark:border-l-green-800",
        hover: "hover:bg-green-100 dark:hover:bg-green-900/30",
      };
    case "rejected":
      return {
        background: "bg-red-50 dark:bg-red-900/20",
        border: "border-l-4 border-l-red-500 dark:border-l-red-800",
        hover: "hover:bg-red-100 dark:hover:bg-red-900/30",
        text: "text-gray-400 line-through opacity-70 dark:text-red-400",
      };
    default:
      return {
        background: "bg-gray-50 dark:bg-gray-800/20",
        border: "border-l-4 border-l-gray-400 dark:border-l-gray-600",
        hover: "hover:bg-gray-100 dark:hover:bg-gray-800/30",
      };
  }
};

// Utility function to get status-based styling for AccordionContent
export const getAccordionContentStyling = (status: string) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case "rejected":
      return "bg-red-50/50 text-gray-600 dark:bg-red-800/40 dark:text-gray-300";
    case "offer":
      return "bg-green-50/50 text-gray-600 dark:bg-green-800/40 dark:text-gray-300";
    case "applied":
      return "bg-sky-50/50 text-gray-600 dark:bg-sky-800/40 dark:text-gray-300";
    case "assessment":
      return "bg-yellow-50/50 text-gray-600 dark:bg-yellow-800/40 dark:text-gray-300";
    case "interview":
      return "bg-purple-50/50 text-gray-600 dark:bg-purple-800/40 dark:text-gray-300";
    default:
      return "bg-gray-50/50 text-gray-600 dark:bg-slate-500";
  }
};
