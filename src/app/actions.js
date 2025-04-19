"use server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function ensureUrlProtocol(url) {
  url = url.trim();
  if (!url) {
    return null;
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

export async function createApplication(previousState, formData) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const company = formData.get("company").toString().trim();
  const position = formData.get("position").toString().trim();
  const location = formData.get("location").toString().trim();
  const status = formData.get("status").toString().trim();
  const urlInput = formData.get("url").toString().trim();
  const notes = formData.get("notes").toString().trim();
  const resumeFile = formData.get("resumeFile");

  let resumeBlobUrl = null;

  const url = ensureUrlProtocol(urlInput);

  if (!company || !position || !status) {
    console.log("Basic validation error: missing required fields", {
      company,
      position,
      status,
      notes,
    });
    return {
      fieldErrors: {
        company: !company ? ["Company is required"] : undefined,
        position: !position ? ["Position is required"] : undefined,
        status: !status ? ["Status is required"] : undefined,
      },
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
        url,
        location,
        appliedAt: new Date(),
        notes,
        resumeUrl: resumeBlobUrl,
        User: { connect: { id: session.user.id } },
      },
    });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return { error: "Failed to save application to database" };
  }

  revalidatePath("/");
  return { message: "Application saved successfully", success: true };
}

export async function updateApplication(previousState, formData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const id = formData.get("id")?.toString();
  if (!id) {
    return { success: false, error: "Application ID is missing." };
  }

  const company = formData.get("company")?.toString().trim();
  const position = formData.get("position")?.toString().trim();
  const status = formData.get("status")?.toString().trim();
  const urlInput = formData.get("url")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim();
  const resumeFile = formData.get("resumeFile");

  let newResumeBlobUrl = undefined;

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

    await prisma.application.update({
      where: { id: application.id },
      data: {
        company,
        position,
        status,
        url: url || null,
        location,
        notes: notes || null,
        resumeUrl:
          newResumeBlobUrl !== undefined
            ? newResumeBlobUrl
            : application.resumeUrl,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Application updated successfully!" };
  } catch (dbError) {
    console.error("Database error during update:", dbError);
    return { success: false, error: "Database error during update" };
  }
}

export async function deleteApplication(id) {
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

export async function removeResume(id) {
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
