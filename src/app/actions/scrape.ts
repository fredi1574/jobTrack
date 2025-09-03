"use server";
import { scrapeJobDetailsWithAI } from "@/lib/ai";
import { getServerAuthSession } from "@/lib/auth";

export type ScrapeResult =
  | {
      success: true;
      data: any;
    }
  | {
      success: false;
      error: string;
    };

export async function scrapeJob(url: string): Promise<ScrapeResult> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  if (!url) {
    return { success: false, error: "URL is required" };
  }

  try {
    const jobDetails = await scrapeJobDetailsWithAI(url);
    return jobDetails;
  } catch (error) {
    return { success: false, error: "Failed to scrape job details" };
  }
}