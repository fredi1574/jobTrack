"use server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/types/contact";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function addContact(contact: ContactForm) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const newContact = await prisma.contact.create({
      data: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        notes: contact.notes,
        company: contact.company,
        position: contact.position,
        userId: session!.user!.id,
      },
    });
    revalidatePath("/contacts");
    return { success: true, contact: newContact };
  } catch (error) {
    return { error: "Failed to create contact" };
  }
}

export async function updateContact(id: string, contact: ContactForm) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const updatedContact = await prisma.contact.update({
      where: {
        id,
        userId: session!.user!.id,
      },
      data: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        notes: contact.notes,
        company: contact.company,
        position: contact.position,
      },
    });
    revalidatePath("/contacts");
    return { success: true, contact: updatedContact };
  } catch (error) {
    return { error: "Failed to update contact" };
  }
}

export async function deleteContact(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.contact.delete({
      where: {
        id,
        userId: session!.user!.id,
      },
    });
    revalidatePath("/contacts");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete contact" };
  }
}
