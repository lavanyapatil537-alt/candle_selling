"use client";

import { useState } from "react";

interface OrderItem { id: string; product_name: string; unit_price: { toString(): string }; quantity: number; subtotal: { toString(): string } }
interface Order { id: string; customer_name: string; phone: string; address: string; total_amount: { toString(): string }; status: string; created_at: Date; order_items: OrderItem[] }

const STATUS_OPTIONS = ["pending", "confirmed", "dispatched", "delivered"];
const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-700 bg-amber-50 border-amber-200",
  confirmed: "text-blue-700 bg-blue-50 border-blue-200",
  dispatched: "text-purple-700 bg-purple-50 border-purple-200",
  delivered: "text-green-700 bg-green-50 border-green-200",
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(orders.map((o) => [o.id, o.status]))
  );

  const updateStatus = async (id: string, status: string) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  if (orders.length === 0) return <p className="text-lexi-muted text-sm">No orders yet.</p>;

  return (
    <div className="bg-white border border-lexi-border">
      <table className="w-full text-sm">
        <thead className="bg-lexi-cream">
          <tr>
            {["ORDER ID", "CUSTOMER", "PHONE", "ITEMS", "TOTAL", "STATUS", "DATE", ""].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-[10px] tracking-widest text-lexi-muted font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-lexi-border">
          {orders.map((o) => (
            <>
              <tr key={o.id} className="hover:bg-lexi-cream/40 transition-colors">
                <td className="px-5 py-4 font-medium text-lexi-gold text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-lexi-dark">{o.customer_name}</p>
                </td>
                <td className="px-5 py-4 text-lexi-muted">{o.phone}</td>
                <td className="px-5 py-4 text-lexi-muted">{o.order_items.length} item{o.order_items.length !== 1 ? "s" : ""}</td>
                <td className="px-5 py-4 font-medium text-lexi-dark">₹{o.total_amount.toString()}</td>
                <td className="px-5 py-4">
                  <select
                    value={statuses[o.id]}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`text-[10px] font-medium tracking-wide uppercase border px-2 py-1 rounded focus:outline-none ${STATUS_COLORS[statuses[o.id]] ?? "text-lexi-muted bg-lexi-cream border-lexi-border"}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4 text-lexi-muted text-xs">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                <td className="px-5 py-4">
                  <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="text-lexi-muted hover:text-lexi-gold transition-colors">
                    <svg className={`w-4 h-4 transition-transform ${expanded === o.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </td>
              </tr>

              {expanded === o.id && (
                <tr key={`${o.id}-detail`}>
                  <td colSpan={8} className="px-5 py-4 bg-lexi-cream border-t border-lexi-border">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] tracking-widest text-lexi-muted mb-3">ORDER DETAILS</p>
                        <table className="w-full text-xs">
                          <tbody className="divide-y divide-lexi-border">
                            {o.order_items.map((item) => (
                              <tr key={item.id}>
                                <td className="py-2 text-lexi-dark">{item.product_name}</td>
                                <td className="py-2 text-lexi-muted">{item.quantity} × ₹{item.unit_price.toString()}</td>
                                <td className="py-2 font-medium text-right">₹{item.subtotal.toString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-between pt-3 mt-2 border-t border-lexi-border font-medium text-xs">
                          <span>Total</span>
                          <span>₹{o.total_amount.toString()}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-widest text-lexi-muted mb-3">SHIPPING ADDRESS</p>
                        <p className="text-xs text-lexi-muted leading-relaxed">{o.address}</p>
                        <p className="text-xs text-lexi-muted mt-2">{o.phone}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
