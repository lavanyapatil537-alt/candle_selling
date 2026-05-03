import Navbar from "@/components/ui/Navbar";
import CollectionGrid from "@/components/ui/CollectionGrid";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { FALLBACK_PRODUCTS } from "@/lib/fallback-products";

export default async function CollectionPage() {
  let products: { id: string; name: string; description: string | null; price: { toString(): string }; fragrance: string | null; image_url: string | null }[] = [];

  try {
    await connectDB();
    const docs = await Product.find({ is_active: true }).sort({ sort_order: 1, created_at: -1 });
    products = docs.length > 0
      ? docs.map((p) => p.toJSON() as unknown as typeof products[number])
      : FALLBACK_PRODUCTS;
  } catch {
    products = FALLBACK_PRODUCTS;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-lexi-gold text-xs tracking-[0.4em] uppercase mb-2">Artisanal Fragments</p>
          <h1 className="font-serif text-5xl text-lexi-dark">The Collection</h1>
        </div>

        <CollectionGrid products={products} />
      </div>

      <footer className="bg-lexi-cream-dark border-t border-lexi-border py-8 px-6 text-center">
        <p className="font-serif text-sm tracking-widest text-lexi-dark mb-3">LEXI CANDLES</p>
        <p className="text-xs text-lexi-muted">© 2024 LEXI CANDLES. Artisanal Fragrance Handcrafted for Serenity.</p>
      </footer>
    </>
  );
}
