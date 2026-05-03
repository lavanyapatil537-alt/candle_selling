import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import type { CartItem } from "@/types/cart";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, phone, address, items, total_amount } = body as {
    customer_name: string;
    phone: string;
    address: string;
    items: CartItem[];
    total_amount: number;
  };

  if (!customer_name || !phone || !address || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();
  const order = await Order.create({
    customer_name,
    phone,
    address,
    total_amount,
    status: "pending",
    order_items: items.map((item) => ({
      product_id: item.product_id,
      product_name: item.name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal: item.unit_price * item.quantity,
    })),
  });

  return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const orders = await Order.find().sort({ created_at: -1 });
  return NextResponse.json(orders);
}

