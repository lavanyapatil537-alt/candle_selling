"use client";

import Link from "next/link";
import { useState } from "react";

interface Product { id: string; name: string; price: { toString(): string }; fragrance: string | null; image_url: string | null; is_active: boolean; is_featured: boolean }

export default function AdminProductsClient({ products }: { products: Product[] }) {
  const [list, setList] = useState(products);

  if (list.length === 0) return <p className="text-lexi-muted text-sm">No products yet. Add your first candle!</p>;

  return (
    <div className="bg-white border border-lexi-border">
      <table className="w-full text-sm">
        <thead className="bg-lexi-cream">
          <tr>
            {["THUMBNAIL", "NAME", "PRICE", "FRAGRANCE", "STATUS", ""].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-[10px] tracking-widest text-lexi-muted font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-lexi-border">
          {list.map((p) => (
            <tr key={p.id} className="hover:bg-lexi-cream/40 transition-colors">
              <td className="px-5 py-3">
                <div className="w-10 h-10 bg-lexi-cream overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                </div>
              </td>
              <td className="px-5 py-3">
                <Link href={`/admin/products/${p.id}/edit`} className="font-medium text-lexi-gold hover:text-lexi-gold-hover transition-colors">
                  {p.name}
                </Link>
              </td>
              <td className="px-5 py-3 text-lexi-dark">₹{p.price.toString()}</td>
              <td className="px-5 py-3 text-lexi-muted text-xs">{p.fragrance ?? "—"}</td>
              <td className="px-5 py-3">
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-medium tracking-wide ${p.is_active ? "text-green-600" : "text-lexi-muted"}`}>
                    {p.is_active ? "● Active" : "○ Hidden"}
                  </span>
                  {p.is_featured && <span className="text-[10px] text-lexi-gold font-medium">★ Featured</span>}
                </div>
              </td>
              <td className="px-5 py-3">
                <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-lexi-muted hover:text-lexi-gold transition-colors">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
