"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  const links = [
    { href: "/", label: "SHOP" },
    { href: "/collection", label: "COLLECTION" },
    { href: "/story", label: "STORY" },
  ];

  return (
    <nav className="bg-white border-b border-lexi-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-base tracking-[0.2em] text-lexi-dark font-semibold">
          LEXI CANDLES
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs tracking-widest transition-colors ${
                pathname === l.href
                  ? "text-lexi-gold border-b border-lexi-gold pb-0.5"
                  : "text-lexi-dark hover:text-lexi-gold"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative text-lexi-dark hover:text-lexi-gold transition-colors"
          aria-label="Open cart"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-lexi-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
