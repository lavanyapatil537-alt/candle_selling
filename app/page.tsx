import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import FeaturedSection from "@/components/ui/FeaturedSection";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let featured: { id: string; name: string; price: { toString(): string }; fragrance: string | null; image_url: string | null }[] = [];
  let config: Record<string, string> = {};

  try {
    const [products, settings] = await Promise.all([
      prisma.product.findMany({ where: { is_active: true, is_featured: true }, orderBy: { sort_order: "asc" }, take: 3 }),
      prisma.siteSetting.findMany(),
    ]);
    featured = products;
    config = Object.fromEntries(settings.map((s) => [s.setting_key, s.setting_value ?? ""]));
  } catch { /* db not configured */ }

  const whatsappNumber = (config.whatsapp_number ?? "").replace(/[\s\-\(\)\+]/g, "");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to place an order on Lexi Candles. Could you help me?")}`
    : null;

  const instagramHandle = config.instagram_url ?? "";
  const instagramUrl = instagramHandle
    ? instagramHandle.startsWith("http") ? instagramHandle : `https://instagram.com/${instagramHandle.replace(/^@/, "")}`
    : null;

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-lexi-cream-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-32 md:py-44 flex flex-col items-center text-center">
          <p className="text-lexi-gold text-xs tracking-[0.4em] uppercase mb-5">
            {config.brand_tagline || "Artisanal Fragrance Handcrafted for Serenity"}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-lexi-dark leading-tight mb-6">
            Lexi Candles
          </h1>
          <p className="text-lexi-muted text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Hand-poured candles for the modern sanctuary. Crafted in small batches using
            sustainably sourced botanical essences.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/collection" className="btn-gold">
              SHOP COLLECTION
            </Link>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 text-xs tracking-widest transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                ORDER VIA WHATSAPP
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl text-center text-lexi-dark mb-2">Featured Collection</h2>
        <p className="text-center text-lexi-muted text-xs tracking-widest mb-12">OUR MOST LOVED SCENTS</p>
        <FeaturedSection products={featured} />
        <div className="text-center mt-12">
          <Link href="/collection" className="btn-outline">VIEW ALL CANDLES</Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-lexi-cream-dark py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-lexi-gold text-xs tracking-[0.4em] uppercase mb-4 text-center">Why Choose Us</p>
          <h2 className="font-serif text-4xl text-lexi-dark text-center mb-14">Crafted with Purpose</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                icon: "🌿",
                title: "100% Natural Ingredients",
                desc: "Every candle is made with premium soy wax, lead-free cotton wicks, and phthalate-free fragrance oils — safe for your home and family.",
              },
              {
                icon: "🕯️",
                title: "Hand-Poured in Small Batches",
                desc: "We pour every candle by hand in batches of twelve to ensure consistent fragrance throw, burn quality, and artisanal attention to detail.",
              },
              {
                icon: "✨",
                title: "Luxury Packaging",
                desc: "Each candle arrives in bespoke packaging designed to delight — perfect as a gift or a personal indulgence for your sanctuary.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="font-serif text-lg text-lexi-dark mb-3">{item.title}</h3>
                <p className="text-lexi-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lexi-gold text-xs tracking-[0.4em] uppercase mb-4">Our Story</p>
          <h2 className="font-serif text-4xl text-lexi-dark mb-8">Made with Intention</h2>
          <p className="text-lexi-muted leading-relaxed mb-5 text-sm">
            Born from a passion for scent and a devotion to the art of slowing down, Lexi Candles celebrates
            the intersection of fragrance and atmosphere. Each candle is meticulously hand-poured in small
            batches using premium soy wax and sustainably sourced botanical essences.
          </p>
          <p className="text-lexi-muted leading-relaxed mb-8 text-sm">
            Our journey began in a small atelier with a single goal: to create artisanal fragrances that don't
            just fill a room, but transform it into a sanctuary.
          </p>
          <Link href="/story" className="text-lexi-gold text-xs tracking-widest underline underline-offset-4 hover:text-lexi-gold-hover transition-colors">
            READ OUR FULL STORY →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lexi-cream-dark border-t border-lexi-border py-10 px-6 text-center">
        <p className="font-serif text-lg tracking-widest text-lexi-dark mb-4">LEXI CANDLES</p>
        <div className="flex justify-center gap-6 text-xs text-lexi-muted mb-4">
          <Link href="/contact" className="hover:text-lexi-gold transition-colors">Contact</Link>
          <Link href="/collection" className="hover:text-lexi-gold transition-colors">Collection</Link>
          <Link href="/story" className="hover:text-lexi-gold transition-colors">Our Story</Link>
          <Link href="/story" className="hover:text-lexi-gold transition-colors">Sustainability</Link>
        </div>
        {(whatsappUrl || instagramUrl) && (
          <div className="flex justify-center gap-4 mb-4">
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-lexi-muted hover:text-[#25D366] transition-colors">WhatsApp</a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-lexi-muted hover:text-lexi-gold transition-colors">Instagram</a>
            )}
          </div>
        )}
        <p className="text-xs text-lexi-muted">© 2024 LEXI CANDLES. Artisanal Fragrance Handcrafted for Serenity.</p>
      </footer>
    </>
  );
}
