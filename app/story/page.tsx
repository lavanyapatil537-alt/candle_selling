import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function StoryPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-lexi-gold text-xs tracking-[0.4em] uppercase mb-4 text-center">Our Story</p>
        <h1 className="font-serif text-5xl text-lexi-dark text-center mb-12">The Lexi Story</h1>

        <div className="prose prose-sm max-w-none text-lexi-muted leading-relaxed space-y-6">
          <p>
            Born from a passion for scent and a devotion to the art of slowing down, Lexi Candles celebrates
            the intersection of fragrance and atmosphere. Each candle is meticulously hand-poured in small
            batches using premium soy wax and sustainably sourced botanical essences.
          </p>
          <p>
            Our journey began in a small atelier with a single goal: to create artisanal fragrances that
            don't just fill a room, but transform it into a sanctuary. From the crackle of our wooden wick
            to the weight of our custom-made glass vessels, every detail is a testament to our commitment
            to luxury and serenity.
          </p>
          <p>
            We source only the finest ingredients — sustainable soy wax, lead-free cotton wicks, and
            phthalate-free fragrance oils that are as kind to your home as they are to the environment.
            Every batch is tested rigorously to ensure a clean, consistent burn from the first light to the last.
          </p>
          <p>
            Lexi Candles is more than a product. It&apos;s a ritual. A moment to breathe, to pause, to
            be present. We believe that the right scent at the right time can transform not just a room,
            but your entire state of mind.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link href="/collection" className="btn-gold">
            EXPLORE THE COLLECTION
          </Link>
        </div>
      </div>

      <footer className="bg-lexi-cream-dark border-t border-lexi-border py-8 px-6 text-center mt-16">
        <p className="font-serif text-sm tracking-widest text-lexi-dark mb-3">LEXI CANDLES</p>
        <p className="text-xs text-lexi-muted">© 2024 LEXI CANDLES. Artisanal Fragrance Handcrafted for Serenity.</p>
      </footer>
    </>
  );
}
