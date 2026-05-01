"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface Props {
  product: { id: string; name: string; price: string; image_url: string };
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-xs tracking-widest text-lexi-dark font-medium">QUANTITY</span>
        <div className="flex items-center border border-lexi-border">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center text-lexi-muted hover:text-lexi-dark transition-colors">−</button>
          <span className="w-9 text-center text-sm">{qty}</span>
          <button onClick={() => setQty(Math.min(99, qty + 1))} className="w-9 h-9 flex items-center justify-center text-lexi-muted hover:text-lexi-dark transition-colors">+</button>
        </div>
      </div>
      <button
        onClick={() => addItem({ product_id: product.id, name: product.name, unit_price: parseFloat(product.price), image_url: product.image_url, quantity: qty })}
        className="btn-gold w-full py-4 text-xs tracking-widest"
      >
        ADD TO CART
      </button>
    </div>
  );
}
