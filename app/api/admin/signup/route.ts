import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured. Please add DATABASE_URL to your .env.local file." },
      { status: 503 }
    );
  }

  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);

    await prisma.adminUser.create({
      data: { name, email, password_hash },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("connect") || message.includes("ECONNREFUSED") || message.includes("P1001")) {
      return NextResponse.json(
        { error: "Cannot connect to database. Check your DATABASE_URL in .env.local." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
