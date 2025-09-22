import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const userApplications = await prisma.application.findMany({
      where: { UserId: session.user.id },
      select: {
        company: true,
        position: true,
        location: true,
        status: true,
        jobSource: true,
        notes: true,
      },
      orderBy: { appliedAt: "desc" },
      take: 10,
    });

    let prompt = `Given the following job applications from a user, suggest 9 new job recommendations. Focus on similar roles, industries, and locations. Provide the output as a JSON array of objects, where each object has 'company', 'position', 'location', 'url' (full and valid URL), and 'description' fields. The description should be a brief, 2-3 sentence summary of why this job is a good fit based on the user's history.

    User's past applications:
    `;

    userApplications.forEach((app) => {
      prompt += `- Company: ${app.company}, Position: ${app.position}, Location: ${app.location}, Status: ${app.status}, Source: ${app.jobSource}
    `;
    });

    prompt += `
Suggestions (JSON array):`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let jsonString = text;
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }

    // Attempt to parse the JSON response
    let recommendations;
    try {
      recommendations = JSON.parse(jsonString);
    } catch (jsonError) {
      console.error("Failed to parse AI response as JSON:", jsonError);
      console.error("AI raw response:", text);
      return new NextResponse(
        JSON.stringify({ error: "Failed to parse AI recommendations." }),
        { status: 500 },
      );
    }

    return new NextResponse(JSON.stringify(recommendations), { status: 200 });
  } catch (error) {
    console.error("Error generating job recommendations:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate job recommendations." }),
      { status: 500 },
    );
  }
}
