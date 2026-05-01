"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  fragrance: string | null;
  image_url: string | null;
}

const ITEMS_PER_PAGE = 4;

export default function CollectionGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const [scentFilter, setScentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  const fragranceOptions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.fragrance) p.fragrance.split(",").forEach((f) => set.add(f.trim()));
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (scentFilter !== "All") {
      list = list.filter((p) => p.fragrance?.toLowerCase().includes(scentFilter.toLowerCase()));
    }
    if (sortBy === "price_asc") list = [...list].sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
    else if (sortBy === "price_desc") list = [...list].sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()));
    else if (sortBy === "name_asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, scentFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilter = (val: string) => { setScentFilter(val); setPage(1); };
  const handleSort = (val: string) => { setSortBy(val); setPage(1); };

  return (
    <>
      {/* Filter & Sort Bar */}
      <div className="flex items-center justify-end gap-3 mb-8">
        <div className="relative">
          <select
            value={scentFilter}
            onChange={(e) => handleFilter(e.target.value)}
            className="appearance-none bg-white border border-lexi-border px-4 py-2 pr-8 text-xs tracking-widest text-lexi-dark focus:outline-none focus:border-lexi-gold cursor-pointer"
          >
            {fragranceOptions.map((f) => (
              <option key={f} value={f}>SCENT PROFILE{f !== "All" ? `: ${f.toUpperCase()}` : ""}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lexi-muted text-xs">▾</span>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="appearance-none bg-white border border-lexi-border px-4 py-2 pr-8 text-xs tracking-widest text-lexi-dark focus:outline-none focus:border-lexi-gold cursor-pointer"
          >
            <option value="default">SORT BY</option>
            <option value="price_asc">PRICE: LOW TO HIGH</option>
            <option value="price_desc">PRICE: HIGH TO LOW</option>
            <option value="name_asc">NAME: A–Z</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lexi-muted text-xs">▾</span>
        </div>
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <p className="text-lexi-muted text-sm py-20 text-center">No products match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {paginated.map((p) => (
            <div key={p.id} className="group bg-white">
              <Link href={`/product/${p.id}`}>
                <div className="aspect-[4/3] bg-lexi-cream overflow-hidden">
                  {p.image_url
                    ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-lexi-cream flex items-center justify-center"><span className="text-lexi-muted text-xs tracking-widest">LEXI</span></div>
                  }
                </div>
              </Link>
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <Link href={`/product/${p.id}`}>
                    <h3 className="font-serif text-xl text-lexi-gold hover:text-lexi-gold-hover transition-colors">{p.name}</h3>
                  </Link>
                  <span className="text-lexi-dark font-medium text-sm">₹{parseFloat(p.price.toString()).toLocaleString()}</span>
                </div>
                {p.fragrance && (
                  <p className="text-lexi-muted text-[10px] tracking-widest uppercase mb-2">
                    {p.fragrance.split(",").join(" · ")}
                  </p>
                )}
                {p.description && (
                  <p className="text-lexi-muted text-xs leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                )}
                <button
                  onClick={() => addItem({ product_id: p.id, name: p.name, unit_price: parseFloat(p.price.toString()), image_url: p.image_url || "" })}
                  className="btn-gold w-full py-3 text-[11px]"
                >
                  QUICK ADD +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 border border-lexi-border flex items-center justify-center text-xs text-lexi-muted hover:border-lexi-gold hover:text-lexi-gold transition-colors disabled:opacity-30"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 border flex items-center justify-center text-xs transition-colors ${
                n === page
                  ? "border-lexi-gold bg-lexi-gold text-white"
                  : "border-lexi-border text-lexi-muted hover:border-lexi-gold hover:text-lexi-gold"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 border border-lexi-border flex items-center justify-center text-xs text-lexi-muted hover:border-lexi-gold hover:text-lexi-gold transition-colors disabled:opacity-30"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
