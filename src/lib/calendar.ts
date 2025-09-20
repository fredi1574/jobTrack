"use client";
import { Application as PrismaApplication } from "@prisma/client";
import { toast } from "sonner";
import { getUserTimeZone } from "./time.utils";

export const addInterviewToCalendar = async (
  application: PrismaApplication,
  session: any,
) => {
  if (!session) {
    toast.error("You need to be logged in to add to calendar.");
    return;
  }

  if (application.status !== "Interview" || !application.interviewDate) {
    toast.error("Only interviews with a set date can be added to calendar.");
    return;
  }

  const interviewDate = new Date(application.interviewDate);
  const startDate = interviewDate;
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  try {
    const response = await fetch("/api/reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: `Interview - ${application.company} - ${application.position}`,
        description: `Interview for ${application.position} at ${application.company}.\nURL: ${application.url || "N/A"}`,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        timeZone: getUserTimeZone(),
      }),
    });

    if (response.ok) {
      toast.success("Interview added to Google Calendar!");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to add to Google Calendar.");
    }
  } catch (error) {
    console.error("Error adding to calendar:", error);
    toast.error("An unexpected error occurred.");
  }
};
