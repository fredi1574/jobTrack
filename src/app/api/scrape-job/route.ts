import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    return NextResponse.json({ message: "Scraping in progress..." });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to scrape job details" },
      { status: 500 },
    );
  }
}
