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

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lowerCaseEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Password strength validation
    // At least 8 characters
    const passwordRegex = /^.{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters long.",
        },
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
