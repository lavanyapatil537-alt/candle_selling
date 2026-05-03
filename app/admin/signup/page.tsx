"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.status === 403) {
      setError("Registration is closed. Please contact the site owner.");
      return;
    }

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/login?registered=1");
  };

  return (
    <div className="min-h-screen bg-lexi-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl tracking-[0.2em] text-lexi-gold">LEXI CANDLES</h1>
          <p className="text-xs tracking-[0.3em] text-lexi-muted mt-2">MANAGEMENT SUITE</p>
        </div>

        <div className="bg-white border border-lexi-border p-10 shadow-sm">
          <h2 className="font-serif text-2xl text-lexi-dark mb-1">Create account</h2>
          <p className="text-lexi-muted text-xs mb-8">Set up your admin credentials to manage Lexi Candles.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest text-lexi-muted mb-2">YOUR NAME</label>
              <input
                type="text"
                className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                placeholder="e.g. Lexi Admin"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest text-lexi-muted mb-2">EMAIL ADDRESS</label>
              <input
                type="email"
                className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                placeholder="admin@lexicandles.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest text-lexi-muted mb-2">PASSWORD</label>
              <input
                type="password"
                className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest text-lexi-muted mb-2">CONFIRM PASSWORD</label>
              <input
                type="password"
                className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "CREATING ACCOUNT..." : <>CREATE ACCOUNT →</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-lexi-muted">
              Already have an account?{" "}
              <Link href="/admin/login" className="text-lexi-gold hover:text-lexi-gold-hover transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
