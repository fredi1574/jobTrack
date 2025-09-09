"use server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureUrlProtocol } from "@/lib/utils";
import { ApplicationStatus } from "@/types/application";
import { Application as PrismaApplication } from "@prisma/client";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

import { ActionResult } from "@/types/actions";

type FormState = ActionResult | undefined | null;

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function getApplications(
  userId: string,
): Promise<PrismaApplication[]> {
  if (!userId) return [];
  try {
    const applications = await prisma.application.findMany({
      where: { UserId: userId },
      orderBy: [{ pinned: "desc" }, { appliedAt: "desc" }],
    });
    return applications;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return [];
  }
}

export async function getApplicationsBySource() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const applications = await prisma.application.findMany({
      where: { UserId: session.user.id },
      select: {
        jobSource: true,
      },
    });

    const sourceCounts: { [key: string]: number } = {};
    applications.forEach((app) => {
      const source = app.jobSource || "Unknown";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    return Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      count,
    }));
  } catch (error) {
    console.error("Failed to fetch applications by source:", error);
    return [];
  }
}

export async function createApplication(
  previousState: FormState,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const company = formData.get("company")?.toString().trim() ?? "";
  const position = formData.get("position")?.toString().trim() ?? "";
  const location = formData.get("location")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString().trim() ?? "";
  const urlInput = formData.get("url")?.toString().trim() ?? "";
  const appliedAt = formData.get("appliedAt")?.toString().trim() ?? "";
  const notes = formData.get("notes")?.toString().trim() ?? "";
  const jobSource = formData.get("jobSource")?.toString().trim() ?? "";
  const salary = formData.get("salary")?.toString().trim();
  const interviewDate = formData.get("interviewDate")?.toString().trim() ?? "";
  const resumeFileValue = formData.get("resumeFile");

  const resumeFile = resumeFileValue instanceof File ? resumeFileValue : null;
  let resumeBlobUrl: string | null = null;

  const url = ensureUrlProtocol(urlInput);

  if (!company || !position || !status) {
    return {
      error: "Company, Position, Location/City, and Status are required.",
      success: false,
    };
  }

  if (resumeFile && resumeFile.size > 0) {
    if (!allowedTypes.includes(resumeFile.type)) {
      return { error: "Resume must be a PDF or Word document", success: false };
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      return { error: "Resume must be less than 5MB", success: false };
    }

    try {
      const uniqueFilename = `${session.user.id}-${Date.now()}-${resumeFile.name}`;

      const blob = await put(uniqueFilename, resumeFile, {
        access: "public",
      });

      resumeBlobUrl = blob.url;
    } catch (uploadError) {
      console.error("Failed to upload resume - Blob Error:", uploadError);
      return {
        success: false,
        error: "Failed to upload resume.",
      };
    }
  }

  try {
    await prisma.application.create({
      data: {
        company,
        position,
        status,
        url: url,
        location,
        appliedAt: (() => {
          const [year, month, day] = appliedAt.split("-").map(Number);
          return new Date(Date.UTC(year, month - 1, day));
        })(),
        notes: notes || null,
        resumeUrl: resumeBlobUrl,
        jobSource: jobSource || null,
        salary: salary ? parseInt(salary) : null,
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        User: { connect: { id: session.user.id } },
      },
    });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return { success: false, error: "Failed to save application to database" };
  }

  revalidatePath("/");
  return { message: "Application saved successfully", success: true };
}

export async function updateApplication(
  previousState: FormState,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const id = formData.get("id")?.toString();
  if (!id) {
    return { success: false, error: "Application ID is missing." };
  }

  const company = formData.get("company")?.toString().trim() ?? "";
  const position = formData.get("position")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString().trim() ?? "";
  const urlInput = formData.get("url")?.toString().trim() ?? "";
  const appliedAt = formData.get("appliedAt")?.toString().trim() ?? "";
  const location = formData.get("location")?.toString().trim() ?? "";
  const notes = formData.get("notes")?.toString().trim() ?? "";
  const jobSource = formData.get("jobSource")?.toString().trim() ?? "";
  const salary = formData.get("salary")?.toString().trim();
  const interviewDate = formData.get("interviewDate")?.toString().trim() ?? "";
  const resumeFileValue = formData.get("resumeFile");

  const resumeFile = resumeFileValue instanceof File ? resumeFileValue : null;
  let newResumeBlobUrl: string | undefined | null = undefined;

  const url = ensureUrlProtocol(urlInput);

  if (!company || !position || !status || !location) {
    return {
      success: false,
      error: "Company, Position, Location, and Status are required.",
    };
  }

  if (resumeFile && resumeFile.size > 0) {
    if (!allowedTypes.includes(resumeFile.type)) {
      return { success: false, error: "Resume must be a PDF or Word document" };
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "Resume must be less than 5MB" };
    }

    try {
      const uniqueFilename = `${session.user.id}-${Date.now()}-${resumeFile.name}`;

      const blob = await put(uniqueFilename, resumeFile, { access: "public" });
      newResumeBlobUrl = blob.url;
    } catch (uploadError) {
      console.error("Failed to upload resume - Blob Error:", uploadError);
      return { success: false, error: "Failed to upload resume." };
    }
  }

  try {
    const application = await prisma.application.findFirst({
      where: {
        id: id,
        UserId: session.user.id,
      },
    });

    if (!application) {
      return {
        success: false,
        error: "Application not found or permission denied.",
      };
    }

    const updateData: any = {
      company,
      position,
      status,
      url: url || null,
      appliedAt: (() => {
        const [year, month, day] = appliedAt.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      })(),
      location,
      notes: notes || null,
      resumeUrl:
        newResumeBlobUrl !== undefined
          ? newResumeBlobUrl
          : application.resumeUrl,
      jobSource: jobSource || null,
      salary: salary ? parseInt(salary) : null,
      interviewDate: interviewDate ? new Date(interviewDate) : null,
    };

    if (application.status !== status) {
      updateData.lastStatusChangeDate = new Date();
    }

    await prisma.application.update({
      where: { id: application.id },
      data: updateData,
    });
  } catch (dbError) {
    console.error("Database error during update:", dbError);
    return { success: false, error: "Database error during update" };
  }

  revalidatePath("/");
  return { success: true, message: "Application updated successfully!" };
}

export async function deleteApplication(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const application = await prisma.application.findFirst({
      where: { id: id, UserId: session.user.id },
    });
    if (!application) {
      return {
        success: false,
        error: "Application not found or permission denied.",
      };
    }

    if (application.resumeUrl) {
      try {
        await del(application.resumeUrl);
      } catch (blobError) {
        console.error("Failed to delete blob file:", blobError);
        return { success: false, error: "Failed to delete associated file." };
      }
    }

    await prisma.application.delete({ where: { id: application.id } });
    revalidatePath("/");
    return { success: true };
  } catch (dbError) {
    console.error("Database error during delete:", dbError);
    return { success: false, error: "Database error during delete" };
  }
}

export async function removeResume(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const application = await prisma.application.findFirst({
      where: { id: id, UserId: session.user.id },
    });
    if (!application) {
      return {
        success: false,
        error: "Application not found or permission denied.",
      };
    }

    if (application.resumeUrl) {
      try {
        await del(application.resumeUrl);
      } catch (blobError) {
        console.error("Failed to delete blob file:", blobError);
        return { success: false, error: "Failed to delete associated file." };
      }
    }

    await prisma.application.update({
      where: { id: application.id },
      data: { resumeUrl: null },
    });
    revalidatePath("/");
    return { success: true };
  } catch (dbError) {
    console.error("Database error during delete:", dbError);
    return { success: false, error: "Database error during delete" };
  }
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const application = await prisma.application.findFirst({
      where: { id: id, UserId: session.user.id },
      select: {
        id: true,
      },
    });
    if (!application) {
      return {
        success: false,
        error: "Application not found or permission denied.",
      };
    }

    await prisma.application.update({
      where: { id: application.id },
      data: { status: status, lastStatusChangeDate: new Date() },
    });
    revalidatePath("/");
    return { success: true };
  } catch (dbError) {
    console.error("Database error during update:", dbError);
    return { success: false, error: "Database error during update" };
  }
}

export async function toggleApplicationPin(
  id: string,
  pinned: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const application = await prisma.application.findFirst({
      where: { id: id, UserId: session.user.id },
      select: {
        id: true,
      },
    });
    if (!application) {
      return {
        success: false,
        error: "Application not found or permission denied.",
      };
    }

    await prisma.application.update({
      where: { id: application.id },
      data: { pinned: !pinned },
    });
    revalidatePath("/");
    return { success: true };
  } catch (dbError) {
    console.error("Database error during update:", dbError);
    return { success: false, error: "Database error during update" };
  }
}

export async function getApplicationLocations(): Promise<string[]> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const locations = await prisma.application.findMany({
      where: { UserId: session.user.id },
      distinct: ["location"],
      select: {
        location: true,
      },
    });
    return locations.map((app) => app.location);
  } catch (error) {
    console.error("Failed to fetch application locations:", error);
    return [];
  }
}

export async function resetLastStatusChangeDate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const application = await prisma.application.findFirst({
      where: { id: id, UserId: session.user.id },
      select: {
        id: true,
      },
    });
    if (!application) {
      return {
        success: false,
        error: "Application not found or permission denied.",
      };
    }

    await prisma.application.update({
      where: { id: application.id },
      data: { lastStatusChangeDate: new Date() },
    });
    revalidatePath("/");
    return { success: true };
  } catch (dbError) {
    console.error("Database error during resetLastStatusChangeDate:", dbError);
    return {
      success: false,
      error: "Database error during resetLastStatusChangeDate",
    };
  }
}
