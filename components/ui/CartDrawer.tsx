"use client";

import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalAmount } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={closeCart} />}

      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-lexi-border">
          <h2 className="font-serif text-xl text-lexi-dark">Your Bag</h2>
          <button onClick={closeCart} className="text-lexi-muted hover:text-lexi-dark transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lexi-muted text-sm">Your bag is empty.</p>
              <button onClick={closeCart} className="mt-4 text-lexi-gold text-sm underline underline-offset-2">
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.product_id} className="flex gap-4">
                  <div className="w-16 h-16 bg-lexi-cream flex-shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-lexi-dark truncate">{item.name}</p>
                    <p className="text-xs text-lexi-muted mt-0.5">₹{item.unit_price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-lexi-border">
                        <button onClick={() => updateQty(item.product_id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-lexi-muted hover:text-lexi-dark transition-colors text-sm">−</button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product_id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-lexi-muted hover:text-lexi-dark transition-colors text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item.product_id)} className="text-lexi-muted hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-lexi-dark flex-shrink-0">₹{(item.unit_price * item.quantity).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-lexi-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-lexi-muted">Subtotal</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-lexi-muted">Shipping</span>
              <span className="text-lexi-gold font-medium tracking-wide text-xs">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between font-medium pt-1 border-t border-lexi-border">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-gold w-full py-3 flex items-center justify-center gap-2"
            >
              PROCEED TO CHECKOUT →
            </button>

            <p className="text-center text-xs text-lexi-muted">🔒 Secure checkout with Lexi Candles</p>
          </div>
        )}
      </div>
    </>
  );
}
