import { getServerAuthSession } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(request: NextRequest) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(request.url);
  const position = searchParams.get("position");
  const location = searchParams.get("location");
  const company = searchParams.get("company");

  if (!position || !location || !company) {
    return NextResponse.json(
      { error: "Position, location, and company are required." },
      { status: 400 },
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const searchQuery = `salary range for ${position} at ${company} in ${location} (Glassdoor OR LinkedIn Salary OR Indeed Salary OR Levels.fyi)`;
    const searchResult = await model.generateContent(searchQuery);
    const searchResponse = searchResult.response;
    const searchResponseText = searchResponse.text();

    const prompt = `Given the following web search results for a salary query, extract the estimated monthly and hourly salary range (min and max) and the currency. If a range is not explicitly stated, provide a single estimated salary. If no relevant salary information is found, state that. Provide the output as a JSON object with 'minSalary', 'maxSalary', 'currency', and 'message' fields. If no salary is found, set minSalary and maxSalary to null.

    Search Results:
    ${searchResponseText}

    Extracted Salary Information (JSON object):`;

    const salaryExtractionResult = await model.generateContent(prompt);
    const salaryExtractionResponse = salaryExtractionResult.response;
    const salaryExtractionText = salaryExtractionResponse.text();

    // Extract JSON from markdown code block
    const jsonMatch = salaryExtractionText.match(/```json\n([\s\S]*?)\n```/);
    let jsonString = salaryExtractionText;
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }

    let salaryData;
    try {
      salaryData = JSON.parse(jsonString);
    } catch (jsonError) {
      console.error("Failed to parse AI salary response as JSON:", jsonError);
      console.error("AI raw response:", salaryExtractionText);
      return new NextResponse(
        JSON.stringify({ error: "Failed to parse AI salary recommendations." }),
        { status: 500 },
      );
    }

    const { minSalary, maxSalary, currency, message } = salaryData;

    return NextResponse.json({
      position,
      location,
      company,
      salaryRange:
        minSalary && maxSalary
          ? `${minSalary} - ${maxSalary} ${currency}`
          : message || "N/A",
      minSalary,
      maxSalary,
      currency,
      message:
        message ||
        "Salary benchmark provided by Gemini AI based on web search.",
    });
  } catch (error) {
    console.error("Error fetching salary benchmark:", error);
    return NextResponse.json(
      { error: "Failed to fetch salary benchmark." },
      { status: 500 },
    );
  }
}
