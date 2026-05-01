import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({ params }: { params: { id: string } }) {
  let product = null;
  try {
    product = await prisma.product.findUnique({ where: { id: params.id, is_active: true } });
  } catch { /* db not configured */ }

  if (!product) notFound();

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image */}
        <div className="aspect-square bg-lexi-cream overflow-hidden">
          {product.image_url
            ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><span className="font-serif text-lexi-muted text-xl tracking-widest">LEXI</span></div>
          }
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="text-lexi-gold text-[10px] tracking-[0.3em] uppercase mb-3">Signature Series</p>
          <h1 className="font-serif text-4xl md:text-5xl text-lexi-dark mb-3 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-serif text-lexi-dark">₹{product.price.toString()}</span>
            {product.burn_time && (
              <span className="text-lexi-muted text-xs">{product.burn_time} Burn Time</span>
            )}
          </div>

          {product.description && (
            <p className="text-lexi-muted text-sm leading-relaxed mb-8">{product.description}</p>
          )}

          {/* Fragrance Profile */}
          {product.fragrance && (
            <div className="mb-8">
              <p className="text-xs tracking-widest text-lexi-dark font-medium mb-3">FRAGRANCE PROFILE</p>
              <div className="flex flex-wrap gap-2">
                {product.fragrance.split(/[,•·]/).map((note) => (
                  <span key={note} className="border border-lexi-border text-lexi-muted text-xs px-3 py-1">
                    {note.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <AddToCartButton product={{ id: product.id, name: product.name, price: product.price.toString(), image_url: product.image_url || "" }} />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-lexi-border">
            {[
              { label: "Sustainability", desc: "100% biodegradable soy wax from ethical farmers." },
              { label: "Craftsmanship", desc: "Hand-poured in small batches of twelve." },
              { label: "Clean Burn", desc: "Lead-free cotton wicks, phthalate-free oils." },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs font-medium text-lexi-dark mb-1">{f.label}</p>
                <p className="text-xs text-lexi-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-lexi-cream-dark border-t border-lexi-border py-8 px-6 text-center">
        <p className="font-serif text-sm tracking-widest text-lexi-dark mb-3">LEXI CANDLES</p>
        <p className="text-xs text-lexi-muted">© 2024 LEXI CANDLES. Artisanal Fragrance Handcrafted for Serenity.</p>
      </footer>
    </>
  );
}
