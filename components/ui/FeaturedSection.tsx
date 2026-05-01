"use client";

import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  price: { toString(): string };
  fragrance: string | null;
  image_url: string | null;
}

export default function FeaturedSection({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return <p className="text-center text-lexi-muted text-sm">No featured products yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p.id} className="group text-center">
          <a href={`/product/${p.id}`}>
            <div className="aspect-square bg-lexi-cream overflow-hidden mb-4">
              {p.image_url
                ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                : <div className="w-full h-full flex items-center justify-center"><span className="text-lexi-muted text-xs tracking-widest">LEXI</span></div>
              }
            </div>
          </a>
          <p className="text-lexi-gold text-[10px] tracking-widest mb-1">SCENT PROFILE</p>
          <h3 className="font-serif text-lg text-lexi-dark mb-1">{p.name}</h3>
          <p className="text-lexi-muted text-xs mb-1">{p.fragrance}</p>
          <p className="text-lexi-dark text-sm font-medium mb-3">₹{p.price.toString()}</p>
          <button
            onClick={() => addItem({ product_id: p.id, name: p.name, unit_price: parseFloat(p.price.toString()), image_url: p.image_url || "" })}
            className="btn-outline w-full text-[11px]"
          >
            ADD TO CART
          </button>
        </div>
      ))}
    </div>
  );
}
