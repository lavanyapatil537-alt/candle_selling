import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  let stats = { totalOrders: 0, pending: 0, delivered: 0, totalRevenue: 0, avgOrderValue: 0 };
  let recentOrders: { id: string; customer_name: string; total_amount: number; status: string; created_at: Date; order_items: { id: string }[] }[] = [];
  let topProducts: { product_name: string; image_url: string | null; totalSold: number }[] = [];
  let monthlyRevenue: { month: string; value: number }[] = [];

  try {
    const [orders, pending, delivered, revenue, allOrders, itemStats] = await Promise.all([
      prisma.order.findMany({ take: 5, orderBy: { created_at: "desc" }, include: { order_items: true } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "delivered" } }),
      prisma.order.aggregate({ _sum: { total_amount: true } }),
      prisma.order.count(),
      prisma.orderItem.groupBy({
        by: ["product_name"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 4,
      }),
    ]);

    const totalRev = Number(revenue._sum.total_amount ?? 0);

    recentOrders = orders.map((o) => ({ ...o, total_amount: Number(o.total_amount) }));

    stats = {
      totalOrders: allOrders,
      pending,
      delivered,
      totalRevenue: totalRev,
      avgOrderValue: allOrders > 0 ? totalRev / allOrders : 0,
    };

    // Top products with image lookup
    const productImages = await prisma.product.findMany({ select: { name: true, image_url: true } });
    const imageMap = Object.fromEntries(productImages.map((p) => [p.name, p.image_url]));
    topProducts = itemStats.map((i) => ({
      product_name: i.product_name,
      image_url: imageMap[i.product_name] ?? null,
      totalSold: i._sum.quantity ?? 0,
    }));

    // Monthly revenue for last 7 months
    const now = new Date();
    const months = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      return { label: d.toLocaleString("en-IN", { month: "short" }).toUpperCase(), year: d.getFullYear(), month: d.getMonth() };
    });

    const revenueByMonth = await Promise.all(
      months.map(async (m) => {
        const start = new Date(m.year, m.month, 1);
        const end = new Date(m.year, m.month + 1, 0, 23, 59, 59);
        const agg = await prisma.order.aggregate({
          where: { created_at: { gte: start, lte: end } },
          _sum: { total_amount: true },
        });
        return { month: m.label, value: Number(agg._sum.total_amount ?? 0) };
      })
    );
    monthlyRevenue = revenueByMonth;
  } catch { /* db not configured */ }

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);

  const STATUS_COLORS: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    confirmed: "text-blue-600 bg-blue-50 border-blue-200",
    dispatched: "text-purple-600 bg-purple-50 border-purple-200",
    delivered: "text-green-600 bg-green-50 border-green-200",
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium text-lexi-dark mb-8">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-lexi-border p-5">
          <p className="text-[10px] tracking-widest text-lexi-muted mb-3">TOTAL REVENUE</p>
          <p className="font-serif text-3xl text-lexi-dark mb-1">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600">+8.4% vs last month</p>
        </div>
        <div className="bg-white border border-lexi-border p-5">
          <p className="text-[10px] tracking-widest text-lexi-muted mb-3">TOTAL ORDERS</p>
          <p className="font-serif text-3xl text-lexi-dark mb-1">{stats.totalOrders.toLocaleString()}</p>
          <p className="text-xs text-green-600">+12% vs last month</p>
        </div>
        <div className="bg-white border border-lexi-border p-5">
          <p className="text-[10px] tracking-widest text-lexi-muted mb-3">AVG. ORDER VALUE</p>
          <p className="font-serif text-3xl text-lexi-dark mb-1">₹{stats.avgOrderValue.toFixed(0)}</p>
          <p className="text-xs text-green-600">+2.1% vs last month</p>
        </div>
        <div className="bg-white border border-lexi-border p-5">
          <p className="text-[10px] tracking-widest text-lexi-muted mb-3">PENDING</p>
          <p className={`font-serif text-3xl mb-1 ${stats.pending > 0 ? "text-amber-600" : "text-lexi-dark"}`}>{stats.pending}</p>
          <p className={`text-xs ${stats.pending > 0 ? "text-amber-500" : "text-lexi-muted"}`}>
            {stats.pending > 0 ? "Requires attention" : "All clear"}
          </p>
        </div>
      </div>

      {/* Revenue Insights + Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-lexi-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] tracking-widest text-lexi-muted">REVENUE INSIGHTS</p>
              <p className="text-sm font-medium text-lexi-dark mt-0.5">Sales Performance</p>
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1 text-[10px] tracking-widest border border-lexi-border text-lexi-muted">DAILY</button>
              <button className="px-3 py-1 text-[10px] tracking-widest bg-lexi-gold text-white">MONTHLY</button>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                  <div
                    className={`w-full transition-all duration-500 ${m.month === monthlyRevenue[monthlyRevenue.length - 1]?.month ? "bg-lexi-gold" : "bg-lexi-cream-dark"}`}
                    style={{ height: `${Math.max(4, (m.value / maxRevenue) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] tracking-wide text-lexi-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-lexi-border p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-medium text-lexi-dark">Top Selling Products</p>
            <Link href="/admin/orders" className="text-[10px] tracking-widest text-lexi-gold hover:underline">FULL REPORT</Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-lexi-muted text-xs">No sales yet.</p>
          ) : (
            <ul className="space-y-4">
              {topProducts.map((p) => (
                <li key={p.product_name} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lexi-cream flex-shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.image_url && <img src={p.image_url} alt={p.product_name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-lexi-dark truncate">{p.product_name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-lexi-dark">{p.totalSold}</p>
                    <p className="text-[9px] text-lexi-muted tracking-wide">SOLD</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Activity + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white border border-lexi-border p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-medium text-lexi-dark">Recent Activity</p>
            <Link href="/admin/orders" className="text-[10px] tracking-widest text-lexi-gold hover:underline">VIEW ALL</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-lexi-muted text-xs">No recent activity.</p>
          ) : (
            <ul className="space-y-4">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-lexi-cream border border-lexi-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-lexi-gold text-xs">🛍</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-lexi-dark">
                      Order placed by <span className="font-medium">{o.customer_name}</span> · ₹{o.total_amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-lexi-muted mt-0.5">
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 border rounded-full font-medium tracking-wide uppercase flex-shrink-0 ${STATUS_COLORS[o.status] ?? "text-lexi-muted bg-lexi-cream border-lexi-border"}`}>
                    {o.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white border border-lexi-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-lexi-border">
            <p className="text-sm font-medium text-lexi-dark">Recent Orders</p>
            <Link href="/admin/orders" className="text-[10px] tracking-widest text-lexi-gold hover:underline">VIEW ALL</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-lexi-muted text-sm">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-lexi-cream">
                <tr>
                  {["CUSTOMER", "ITEMS", "TOTAL", "STATUS"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] tracking-widest text-lexi-muted font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-lexi-border">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-lexi-cream/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-lexi-dark text-xs">{o.customer_name}</td>
                    <td className="px-5 py-3 text-lexi-muted text-xs">{o.order_items.length}</td>
                    <td className="px-5 py-3 font-medium text-xs">₹{o.total_amount.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 border rounded-full text-[9px] font-medium tracking-wide uppercase ${STATUS_COLORS[o.status] ?? "text-lexi-muted bg-lexi-cream border-lexi-border"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
