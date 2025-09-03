"use server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseDateString } from "@/lib/utils";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/actions";

export async function importApplications(
  previousState: ActionResult | undefined | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: "No file uploaded." };
  }

  if (file.type !== "text/csv") {
    return { success: false, error: "Please select a valid CSV file." };
  }

  try {
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
        UserId: session.user!.id,
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
        jobSource: getVal("jobsource") || null,
        salary: getVal("salary") ? parseInt(getVal("salary")) : null,
      };
    });

    await prisma.application.createMany({
      data: applicationsToCreate,
      skipDuplicates: true,
    });

    revalidatePath("/");
    return { success: true, message: "CSV imported successfully!" };
  } catch (error) {
    console.error("Error importing CSV:", error);
    return { success: false, error: "Failed to import CSV." };
  }
}
