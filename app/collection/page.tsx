import Navbar from "@/components/ui/Navbar";
import CollectionGrid from "@/components/ui/CollectionGrid";
import { prisma } from "@/lib/prisma";

export default async function CollectionPage() {
  let products: { id: string; name: string; description: string | null; price: { toString(): string }; fragrance: string | null; image_url: string | null }[] = [];

  try {
    products = await prisma.product.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });
  } catch { /* db not configured */ }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-lexi-gold text-xs tracking-[0.4em] uppercase mb-2">Artisanal Fragments</p>
          <h1 className="font-serif text-5xl text-lexi-dark">The Collection</h1>
        </div>

        {products.length === 0 ? (
          <p className="text-lexi-muted text-sm py-20 text-center">No products available yet.</p>
        ) : (
          <CollectionGrid products={products} />
        )}
      </div>

      <footer className="bg-lexi-cream-dark border-t border-lexi-border py-8 px-6 text-center">
        <p className="font-serif text-sm tracking-widest text-lexi-dark mb-3">LEXI CANDLES</p>
        <p className="text-xs text-lexi-muted">© 2024 LEXI CANDLES. Artisanal Fragrance Handcrafted for Serenity.</p>
      </footer>
    </>
  );
}
