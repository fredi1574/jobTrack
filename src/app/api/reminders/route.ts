import { getServerAuthSession } from "@/lib/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerAuthSession();

  if (!session || !session.user || !session.user.id || !session.accessToken) {
    return new NextResponse("Unauthorized or missing access token", { status: 401 });
  }

  const {
    summary,
    description,
    startDateTime,
    endDateTime,
    timeZone,
  } = await req.json();

  if (!summary || !startDateTime || !endDateTime) {
    return new NextResponse("Missing required event details", { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: session.accessToken as string,
      refresh_token: session.refreshToken as string,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: summary,
      description: description,
      start: {
        dateTime: startDateTime,
        timeZone: timeZone || "UTC",
      },
      end: {
        dateTime: endDateTime,
        timeZone: timeZone || "UTC",
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary", // 'primary' refers to the user's primary calendar
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return new NextResponse("Failed to create calendar event", { status: 500 });
  }
}
