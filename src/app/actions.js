"use server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createApplication(previousState, formData) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const company = formData.get("company").toString().trim();
  const position = formData.get("position").toString().trim();
  const city = formData.get("city").toString().trim();
  const status = formData.get("status").toString().trim();
  const url = formData.get("url").toString().trim();
  const notes = formData.get("notes").toString().trim();

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

  try {
    await prisma.application.create({
      data: {
        company,
        position,
        status,
        url,
        city,
        appliedAt: new Date(),
        notes,
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

export async function deleteApplication(id) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
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

    await prisma.application.delete({
      where: { id: application.id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (dbError) {
    console.error("Database error during delete:", dbError);
    return { success: false, error: "Database error during delete" };
  }
}
