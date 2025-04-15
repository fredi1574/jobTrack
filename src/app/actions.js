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
  const status = formData.get("status").toString().trim();
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
