import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import SiteSetting from "@/models/SiteSetting";

export async function GET() {
  await connectDB();
  const settings = await SiteSetting.find();
  const map = Object.fromEntries(settings.map((s) => [s.setting_key, s.setting_value ?? ""]));
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body: Record<string, string> = await req.json();

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      SiteSetting.findOneAndUpdate(
        { setting_key: key },
        { setting_value: value },
        { upsert: true, new: true }
      )
    )
  );

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  await SiteSetting.deleteMany();
  return NextResponse.json({ success: true });
}

