import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { is_active: true },
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
  });
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

  const product = await prisma.product.create({
    data: { name, description, price, fragrance, burn_time, image_url, is_active: is_active ?? true, is_featured: is_featured ?? false, sort_order },
  });

  return NextResponse.json(product, { status: 201 });
}
