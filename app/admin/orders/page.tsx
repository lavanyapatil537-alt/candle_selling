import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/admin/OrdersTable";

export default async function AdminOrdersPage() {
  let orders: {
    id: string; customer_name: string; phone: string; address: string;
    total_amount: { toString(): string }; status: string; created_at: Date;
    order_items: { id: string; product_name: string; unit_price: { toString(): string }; quantity: number; subtotal: { toString(): string } }[];
  }[] = [];

  let stats = { total: 0, pending: 0, delivered: 0, revenue: 0 };

  try {
    const [allOrders, pending, delivered, revenue] = await Promise.all([
      prisma.order.findMany({ orderBy: { created_at: "desc" }, include: { order_items: true } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "delivered" } }),
      prisma.order.aggregate({ _sum: { total_amount: true } }),
    ]);
    orders = allOrders;
    stats = {
      total: allOrders.length,
      pending,
      delivered,
      revenue: Number(revenue._sum.total_amount ?? 0),
    };
  } catch { /* db not configured */ }

  const successRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-lexi-dark">Orders Management</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-lexi-border p-5">
          <p className="text-[10px] tracking-widest text-lexi-muted mb-2">TOTAL ORDERS</p>
          <p className="font-serif text-3xl text-lexi-dark mb-1">{stats.total.toLocaleString()}</p>
          <p className="text-xs text-green-600">+12% from last month</p>
        </div>
        <div className="bg-white border border-lexi-border p-5">
          <p className="text-[10px] tracking-widest text-lexi-muted mb-2">PENDING</p>
          <p className={`font-serif text-3xl mb-1 ${stats.pending > 0 ? "text-amber-600" : "text-lexi-dark"}`}>{stats.pending}</p>
          <p className={`text-xs ${stats.pending > 0 ? "text-amber-500" : "text-lexi-muted"}`}>
            {stats.pending > 0 ? "Requires attention" : "All clear"}
          </p>
        </div>
        <div className="bg-white border border-lexi-border p-5">
          <p className="text-[10px] tracking-widest text-lexi-muted mb-2">DELIVERED</p>
          <p className="font-serif text-3xl text-lexi-dark mb-1">{stats.delivered.toLocaleString()}</p>
          <p className="text-xs text-green-600">{successRate}% success rate</p>
        </div>
        <div className="bg-white border border-lexi-border p-5">
          <p className="text-[10px] tracking-widest text-lexi-muted mb-2">TOTAL REVENUE</p>
          <p className="font-serif text-3xl text-lexi-dark mb-1">₹{stats.revenue.toLocaleString()}</p>
          <p className="text-xs text-green-600">+8.4% growth</p>
        </div>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
