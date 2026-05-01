import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { is_featured: true },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json(products);
}
