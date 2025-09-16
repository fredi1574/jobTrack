"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function parseJobDetails(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Extract the following job details from the text below:
    - Company Name
    - Position/Job Title
    - Location
    - Job URL
    - Job Source (e.g., LinkedIn, company website)
    - Salary
    - Notes (as an array of strings, each string being a bullet point or important detail)

    Return the data in JSON format. If a field is not found, return null for that field.
    If the Job Source not found, return Company Website for that field.
    The JSON should have the following keys: company, position, location, url, jobSource, salary, and notes.

    Text: ${text}
  `;

  const maxRetries = 3;
  let result;
  for (let i = 0; i < maxRetries; i++) {
    try {
      result = await model.generateContent(prompt);
      break;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
    }
  }

  if (!result) {
    throw new Error(
      "AI model failed to generate content after multiple retries.",
    );
  }

  const jsonResponse = result.response
    .text()
    .replace(/```json|```/g, "")
    .trim();

  if (!jsonResponse) {
    throw new Error("Could not extract content from the AI response.");
  }

  try {
    const data = JSON.parse(jsonResponse);
    return data;
  } catch (error) {
    console.error("Error parsing JSON from AI response:", error);
    throw new Error("Error parsing AI response.");
  }
}
