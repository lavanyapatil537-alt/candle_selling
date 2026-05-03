import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { current, next } = await req.json();
  if (!current || !next) {
    return NextResponse.json({ error: "Both current and new password are required." }, { status: 400 });
  }

  await connectDB();

  const admin = await AdminUser.findOne({ email: session.user.email });
  if (!admin) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const valid = await bcrypt.compare(current, admin.password_hash);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

  const password_hash = await bcrypt.hash(next, 12);
  await AdminUser.findByIdAndUpdate(admin._id, { password_hash });

  return NextResponse.json({ success: true });
}

