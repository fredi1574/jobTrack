import { ScrapeResult } from "@/app/actions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { chromium } from "playwright";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function scrapeJobDetailsWithAI(
  url: string,
): Promise<ScrapeResult> {
  let browser = null;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const pageUrl = page.url();
    if (pageUrl.includes("linkedin.com")) {
      return {
        success: false,
        error:
          "This LinkedIn job is protected and requires login. Please enter the details manually.",
      };
    }

    const textContent = await page.textContent("body");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Extract the following job details from the text below:
      - Company Name
      - Position/Job Title
      - Location
      - Job Source (e.g., LinkedIn, company website)
      - Salary
      - Notes

      Return the data in JSON format. If a field is not found, return null for that field.
      If the Job Source not found, return Company Website for that field.
      Add notes only if they are very important and include technical requirements in bullet points.

      Text: ${textContent}
    `;

    const result = await model.generateContent(prompt);
    const jsonResponse = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    console.log("JSON Response:", jsonResponse);

    if (!jsonResponse) {
      return {
        success: false,
        error: "Could not extract content from the page.",
      };
    }

    try {
      const data = JSON.parse(jsonResponse);
      return { success: true, data };
    } catch (error) {
      console.error("Error parsing JSON from AI response:", error);
      return { success: false, error: "Error parsing AI response." };
    }
  } catch (error) {
    console.error("Error scraping job details with AI:", error);
    if (error instanceof Error && error.name === "TimeoutError") {
      return {
        success: false,
        error:
          "The page took too long to load. Please try again or enter the details manually.",
      };
    }
    return {
      success: false,
      error: "Failed to scrape job details. Please enter the details manually.",
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
