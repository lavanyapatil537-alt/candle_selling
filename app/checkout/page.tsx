"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/ui/Navbar";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const [form, setForm] = useState({ customer_name: "", phone: "", address: "" });
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        setWhatsapp(s.whatsapp_number ?? "");
        setInstagram(s.instagram_url ?? "");
      })
      .catch(() => {});
  }, []);

  const buildWhatsAppUrl = () => {
    const number = whatsapp.replace(/[\s\-\(\)\+]/g, "");
    const lines = items.map((i) => `• ${i.name} × ${i.quantity} — ₹${(i.unit_price * i.quantity).toLocaleString()}`).join("\n");
    const message =
      `Hi! I'd like to place an order on Lexi Candles:\n\n` +
      `${lines}\n\n` +
      `Total: ₹${totalAmount.toLocaleString()}\n\n` +
      `Name: ${form.customer_name}\n` +
      `Phone: ${form.phone}\n` +
      `Address: ${form.address}\n\n` +
      `Please confirm my order. Thank you!`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  const buildInstagramUrl = () => {
    if (!instagram) return "";
    if (instagram.startsWith("http")) return instagram;
    const handle = instagram.replace(/^@/, "").replace(/^instagram\.com\//, "");
    return `https://instagram.com/${handle}`;
  };

  const saveOrder = async () => {
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          phone: form.phone,
          address: form.address,
          total_amount: totalAmount,
          items: items.map((i) => ({
            product_id: i.product_id,
            name: i.name,
            unit_price: i.unit_price,
            quantity: i.quantity,
            subtotal: i.unit_price * i.quantity,
          })),
        }),
      });
    } catch { /* non-blocking */ }
  };

  const handleWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveOrder();
    window.open(buildWhatsAppUrl(), "_blank");
    clearCart();
  };

  const handleInstagram = async () => {
    await saveOrder();
    window.open(buildInstagramUrl(), "_blank");
    clearCart();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl text-lexi-dark mb-2">Checkout</h1>
        <p className="text-lexi-muted text-sm mb-10">Finalize your artisanal selection by providing your delivery information below.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white border border-lexi-border p-6">
              <h2 className="font-medium text-lexi-dark text-sm mb-5">Order Summary</h2>
              {items.length === 0 ? (
                <p className="text-lexi-muted text-xs">Your bag is empty.</p>
              ) : (
                <ul className="space-y-4 mb-5">
                  {items.map((item) => (
                    <li key={item.product_id} className="flex gap-3">
                      <div className="w-12 h-12 bg-lexi-cream flex-shrink-0 overflow-hidden">
                        {item.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-lexi-dark truncate">{item.name}</p>
                        <p className="text-xs text-lexi-muted">{item.quantity} × 12oz Soy Candle</p>
                        <p className="text-xs text-lexi-gold font-medium">₹{(item.unit_price * item.quantity).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="border-t border-lexi-border pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-lexi-muted"><span>Subtotal</span><span>₹{totalAmount.toLocaleString()}</span></div>
                <div className="flex justify-between text-lexi-muted"><span>Shipping</span><span className="text-lexi-gold font-medium">COMPLIMENTARY</span></div>
                <div className="flex justify-between font-medium text-lexi-dark text-sm pt-1 border-t border-lexi-border"><span>Total</span><span>₹{totalAmount.toLocaleString()}</span></div>
              </div>
              <div className="mt-4 bg-lexi-cream p-3 text-xs text-lexi-muted leading-relaxed">
                <span className="font-medium text-lexi-dark">NOTE</span> — Once you place your order via WhatsApp or Instagram, our team will confirm it and share delivery details.
              </div>
            </div>
          </div>

          {/* Form + Order Buttons */}
          <div className="md:col-span-2">
            <div className="bg-white border border-lexi-border p-8">
              <h2 className="font-medium text-lexi-dark text-lg mb-6">Shipping Details</h2>
              <form onSubmit={handleWhatsApp} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-widest text-lexi-muted mb-2">FULL NAME</label>
                    <input
                      className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                      placeholder="E.g. Julian Thorne"
                      value={form.customer_name}
                      onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest text-lexi-muted mb-2">PHONE NUMBER</label>
                    <input
                      className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                      placeholder="+91 9876 543 210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest text-lexi-muted mb-2">DELIVERY ADDRESS</label>
                  <textarea
                    className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                    rows={4}
                    placeholder="Enter your full street address, apartment, suite, etc."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-3 pt-2">
                  {whatsapp && (
                    <button
                      type="submit"
                      disabled={items.length === 0}
                      className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-4 text-sm tracking-widest transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      PLACE ORDER VIA WHATSAPP
                    </button>
                  )}

                  {instagram && (
                    <button
                      type="button"
                      onClick={handleInstagram}
                      disabled={items.length === 0}
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white py-4 text-sm tracking-widest transition-opacity disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      PLACE ORDER VIA INSTAGRAM
                    </button>
                  )}

                  {!whatsapp && !instagram && (
                    <p className="text-center text-xs text-lexi-muted border border-lexi-border p-4">
                      No contact channels configured. Add WhatsApp or Instagram in{" "}
                      <a href="/admin/settings" className="text-lexi-gold underline">Admin → Settings</a>.
                    </p>
                  )}
                </div>

                <p className="text-center text-xs text-lexi-muted">🔒 SECURE CHECKOUT</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
