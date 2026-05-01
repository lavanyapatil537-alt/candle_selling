"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError("Invalid email or password.");
    else router.push("/admin/dashboard");
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
          <h2 className="font-serif text-2xl text-lexi-dark mb-1">Welcome back</h2>
          <p className="text-lexi-muted text-xs mb-8">Please enter your credentials to manage your artisanal collection.</p>

          {justRegistered && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 mb-6">
              Account created successfully. You can now sign in.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest text-lexi-muted mb-2">EMAIL ADDRESS</label>
              <input
                type="email"
                className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                placeholder="admin@lexicandles.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs tracking-widest text-lexi-muted">PASSWORD</label>
              </div>
              <input
                type="password"
                className="w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : <>SIGN IN →</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-lexi-muted">
              New here?{" "}
              <Link href="/admin/signup" className="text-lexi-gold hover:text-lexi-gold-hover transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
