import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, phone, notes, company, position } = await req.json();

  const contact = await prisma.contact.update({
    where: {
      id: params.id,
      userId: session.user?.id,
    },
    data: {
      name,
      email,
      phone,
      notes,
      company,
      position,
    },
  });

  return NextResponse.json(contact);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.contact.delete({
    where: {
      id: params.id,
      userId: session.user?.id,
    },
  });

  return NextResponse.json({ success: true });
}
