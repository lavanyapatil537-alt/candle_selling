import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  const products = await Product.find({ is_active: true }).sort({ sort_order: 1, created_at: -1 });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, price, fragrance, burn_time, image_url, is_active, is_featured, sort_order } = body;

  if (!name || !price) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  await connectDB();
  const product = await Product.create({
    name, description, price, fragrance, burn_time, image_url,
    is_active: is_active ?? true,
    is_featured: is_featured ?? false,
    sort_order,
  });

  return NextResponse.json(product, { status: 201 });
}

