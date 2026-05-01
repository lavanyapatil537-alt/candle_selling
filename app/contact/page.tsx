"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((s) => {
      setWhatsapp(s.whatsapp_number ?? "");
      setInstagram(s.instagram_url ?? "");
    }).catch(() => {});
  }, []);

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[\s\-\(\)\+]/g, "")}?text=${encodeURIComponent("Hi! I have a question about Lexi Candles.")}`
    : null;

  const instagramUrl = instagram
    ? instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace(/^@/, "")}`
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "sent" : "error");
    if (res.ok) setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-lexi-gold text-xs tracking-[0.4em] uppercase mb-4 text-center">Get in Touch</p>
        <h1 className="font-serif text-5xl text-lexi-dark text-center mb-4">Contact Us</h1>
        <p className="text-lexi-muted text-sm text-center mb-10">
          Have a question or want to know more? Reach us directly or send a message below.
        </p>

        {/* WhatsApp + Instagram buttons */}
        {(whatsappUrl || instagramUrl) && (
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 text-xs tracking-widest transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                CHAT ON WHATSAPP
              </a>
            )}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white py-3 text-xs tracking-widest transition-opacity"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                FOLLOW ON INSTAGRAM
              </a>
            )}
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-white border border-lexi-border p-8">
          <p className="text-xs tracking-widest text-lexi-muted mb-6">OR SEND US A MESSAGE</p>
          {status === "sent" ? (
            <div className="text-center py-8">
              <p className="font-serif text-2xl text-lexi-dark mb-2">Thank you!</p>
              <p className="text-lexi-muted text-sm">We've received your message and will get back to you soon.</p>
              <button onClick={() => setStatus("idle")} className="mt-6 text-lexi-gold text-xs tracking-widest underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs tracking-widest text-lexi-muted mb-2">NAME</label>
                <input className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs tracking-widest text-lexi-muted mb-2">EMAIL</label>
                <input type="email" className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs tracking-widest text-lexi-muted mb-2">MESSAGE</label>
                <textarea rows={5} className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              {status === "error" && <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>}
              <button type="submit" disabled={status === "sending"} className="btn-gold w-full py-4 disabled:opacity-50">
                {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="bg-lexi-cream-dark border-t border-lexi-border py-8 px-6 text-center">
        <p className="font-serif text-sm tracking-widest text-lexi-dark mb-3">LEXI CANDLES</p>
        <p className="text-xs text-lexi-muted">© 2024 LEXI CANDLES. Artisanal Fragrance Handcrafted for Serenity.</p>
      </footer>
    </>
  );
}
