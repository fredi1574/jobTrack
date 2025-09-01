import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Application as PrismaApplication } from "@prisma/client";

export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get status-based styling for AccordionItem and Trigger
export const getStatusStyling = (status: string) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case "applied":
      return {
        background: "bg-sky-100 dark:bg-sky-900/30",
        border: "border-l-4 border-l-sky-500 dark:border-l-sky-700",
        hover: "hover:bg-sky-200/60 dark:hover:bg-sky-900/40",
      };
    case "assessment":
      return {
        background: "bg-yellow-100 dark:bg-yellow-900/30",
        border: "border-l-4 border-l-yellow-500 dark:border-l-yellow-700",
        hover: "hover:bg-yellow-200/60 dark:hover:bg-yellow-900/40",
      };
    case "interview":
      return {
        background: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-l-4 border-l-purple-500 dark:border-l-purple-700",
        hover: "hover:bg-purple-200/60 dark:hover:bg-purple-900/40",
      };
    case "offer":
      return {
        background: "bg-green-100 dark:bg-green-900/30",
        border: "border-l-4 border-l-green-500 dark:border-l-green-700",
        hover: "hover:bg-green-200/60 dark:hover:bg-green-900/40",
      };
    case "rejected":
      return {
        background: "bg-red-100 dark:bg-red-900/30",
        border: "border-l-4 border-l-red-500 dark:border-l-red-700",
        hover: "hover:bg-red-200/60 dark:hover:bg-red-900/40",
        text: "text-red-500 line-through opacity-80 dark:text-red-500",
      };
  }
};

// Utility function to get status-based styling for AccordionContent
export const getAccordionContentStyling = (status: string) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case "rejected":
      return "bg-red-50/70 dark:bg-red-900/20";
    case "offer":
      return "bg-green-50/70 dark:bg-green-900/20";
    case "applied":
      return "bg-sky-50/70 dark:bg-sky-900/20";
    case "assessment":
      return "bg-yellow-50/70 dark:bg-yellow-900/20";
    case "interview":
      return "bg-purple-50/70 dark:bg-purple-900/20";
    default:
      return "bg-gray-50/50 dark:bg-slate-500";
  }
};