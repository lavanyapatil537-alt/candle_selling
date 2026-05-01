"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";

function OrderForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    product_name: params.get("product") ?? "",
    quantity: 1,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/?ordered=1");
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name *</label>
        <input
          className="w-full border border-brand-brown/30 px-4 py-2 bg-white focus:outline-none focus:border-brand-gold"
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone (with country code) *</label>
        <input
          className="w-full border border-brand-brown/30 px-4 py-2 bg-white focus:outline-none focus:border-brand-gold"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Delivery Address *</label>
        <textarea
          className="w-full border border-brand-brown/30 px-4 py-2 bg-white focus:outline-none focus:border-brand-gold"
          rows={3}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Product *</label>
        <input
          className="w-full border border-brand-brown/30 px-4 py-2 bg-white focus:outline-none focus:border-brand-gold"
          value={form.product_name}
          onChange={(e) => setForm({ ...form, product_name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Quantity *</label>
        <input
          type="number"
          min={1}
          className="w-full border border-brand-brown/30 px-4 py-2 bg-white focus:outline-none focus:border-brand-gold"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes (optional)</label>
        <textarea
          className="w-full border border-brand-brown/30 px-4 py-2 bg-white focus:outline-none focus:border-brand-gold"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-dark text-brand-cream py-3 text-sm tracking-widest hover:bg-brand-brown transition disabled:opacity-50"
      >
        {loading ? "PLACING ORDER..." : "PLACE ORDER"}
      </button>
    </form>
  );
}

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-serif text-center mb-2">Place Your Order</h1>
        <p className="text-center text-brand-brown/50 text-sm mb-10">
          Fill in your details and we&apos;ll confirm your order via WhatsApp.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <OrderForm />
        </Suspense>
      </div>
    </>
  );
}
