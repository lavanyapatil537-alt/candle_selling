import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Database not configured. Please add MONGODB_URI to your .env.local file." },
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

    await connectDB();

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);
    await AdminUser.create({ name, email, password_hash });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("connect") || message.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { error: "Cannot connect to database. Check your MONGODB_URI in .env.local." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
