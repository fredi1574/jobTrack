import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const lowerCaseEmail = email.toLowerCase().trim();

    if (!lowerCaseEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: lowerCaseEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: lowerCaseEmail,
        password: hashed,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration." },
      { status: 500 },
    );
  }
}
