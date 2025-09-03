import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";

function parseDateString(dateString: string): Date | null {
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const csvString = buffer.toString("utf-8");

    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
      bom: true, // Handle UTF-8 Byte Order Mark
      trim: true, // Trim whitespace from fields
    });

    const applicationsToCreate = records.map((record: any) => {
      const getVal = (key: string) => {
        const recordKey = Object.keys(record).find(
          (k) => k.toLowerCase().trim() === key,
        );
        return recordKey ? record[recordKey] : undefined;
      };

      return {
        UserId: userId,
        company: getVal("company") || "",
        position: getVal("position") || "",
        location: getVal("location") || "",
        url: getVal("url") || null,
        status: getVal("status") || "Applied",
        notes: getVal("notes") || null,
        resumeUrl: getVal("resumeurl") || null,
        import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import { parseDateString } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const csvString = buffer.toString("utf-8");

    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
      bom: true, // Handle UTF-8 Byte Order Mark
      trim: true, // Trim whitespace from fields
    });

    const applicationsToCreate = records.map((record: any) => {
      const getVal = (key: string) => {
        const recordKey = Object.keys(record).find(
          (k) => k.toLowerCase().trim() === key,
        );
        return recordKey ? record[recordKey] : undefined;
      };

      return {
        UserId: userId,
        company: getVal("company") || "",
        position: getVal("position") || "",
        location: getVal("location") || "",
        url: getVal("url") || null,
        status: getVal("status") || "Applied",
        notes: getVal("notes") || null,
        resumeUrl: getVal("resumeurl") || null,
        appliedAt: getVal("appliedat")
          ? parseDateString(getVal("appliedat")) || new Date()
          : new Date(),
      };
    });

    await prisma.application.createMany({
      data: applicationsToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: "CSV imported successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error importing CSV:", error);
    return NextResponse.json(
      { error: "Failed to import CSV." },
      { status: 500 },
    );
  }
}

      };
    });

    await prisma.application.createMany({
      data: applicationsToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: "CSV imported successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error importing CSV:", error);
    return NextResponse.json(
      { error: "Failed to import CSV." },
      { status: 500 },
    );
  }
}
