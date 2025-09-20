import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get status-based styling for AccordionContent
export const getAccordionContentStyling = (status: string) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case "rejected":
      return "bg-[#FFF1F1] dark:bg-red-900/20";
    case "offer":
      return "bg-[#EBFBFA] dark:bg-green-900";
    case "applied":
      return "bg-[#EBF8FF] dark:bg-sky-900/20";
    case "assessment":
      return "bg-[#FFF8E6] dark:bg-yellow-900/20";
    case "interview":
      return "bg-[#F2F0FF] dark:bg-purple-900/20";
    default:
      return "bg-gray-50/50 dark:bg-slate-500";
  }
};

export function ensureUrlProtocol(
  url: string | null | undefined,
): string | null {
  const trimmedUrl = url?.trim();
  if (!trimmedUrl) {
    return null;
  }

  // Prepend protocol if missing. Using a regex is more efficient than toLowerCase().
  const urlWithProtocol = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  try {
    // Use the URL constructor to validate the URL's structure.
    new URL(urlWithProtocol);
    return urlWithProtocol;
  } catch {
    // If the URL is invalid (e.g., contains spaces), return null.
    return null;
  }
}

export function parseDateString(dateString: string): Date | null {
  if (!dateString) {
    return null;
  }

  // Try to parse with different formats
  let date: Date | null = null;

  // Try DD MM YYYY
  let parts = dateString.split(" ");
  if (parts.length === 3) {
    date = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0]),
    );
    if (!isNaN(date.getTime())) return date;
  }

  // Try DD/MM/YYYY
  parts = dateString.split("/");
  if (parts.length === 3) {
    date = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0]),
    );
    if (!isNaN(date.getTime())) return date;
  }

  // Try DD-MM-YYYY
  parts = dateString.split("-");
  if (parts.length === 3) {
    date = new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0]),
    );
    if (!isNaN(date.getTime())) return date;
  }

  // Try YYYY-MM-DD
  if (parts.length === 3) {
    date = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2]),
    );
    if (!isNaN(date.getTime())) return date;
  }

  // Fallback for other formats that new Date() might handle
  date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return null;
}
