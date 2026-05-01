import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Velvet Oud",
        description: "A rich, smoky blend of dark oud wood and velvety sandalwood. Hand-poured in small batches for a warm, grounding atmosphere that lingers long after the flame is extinguished.",
        price: 2450,
        fragrance: "Oud, Sandalwood, Saffron",
        burn_time: "45–50 hours",
        image_url: "https://images.unsplash.com/photo-1707839568483-9f1924d5f5de?w=600&h=600&fit=crop&q=80",
        is_active: true,
        is_featured: true,
        sort_order: 1,
      },
      {
        name: "Ivory Blossom",
        description: "A delicate floral bouquet of fresh jasmine and white peony, layered with soft bergamot. Perfect for brightening any space with effortless elegance.",
        price: 2350,
        fragrance: "Jasmine, Neroli, Bergamot",
        burn_time: "40–45 hours",
        image_url: "https://images.unsplash.com/photo-1707839568431-c2648f6d5184?w=600&h=600&fit=crop&q=80",
        is_active: true,
        is_featured: true,
        sort_order: 2,
      },
      {
        name: "Midnight Pine",
        description: "Step into a forest at dusk. Cedar, pine needle, and a touch of earthy moss create an immersive, grounding escape for the modern home.",
        price: 2350,
        fragrance: "Fir Needle, Cedar, Moss",
        burn_time: "50–55 hours",
        image_url: "https://images.unsplash.com/photo-1707839568443-912e7206c726?w=600&h=600&fit=crop&q=80",
        is_active: true,
        is_featured: true,
        sort_order: 3,
      },
      {
        name: "Amber & Oakwood",
        description: "A warm, grounding fragrance inspired by old libraries and crackling fireplaces. Handcrafted with sustainable soy wax.",
        price: 1450,
        fragrance: "Smoky Amber, Aged Oak, Vanilla Bean",
        burn_time: "35–40 hours",
        image_url: "https://images.unsplash.com/photo-1760804876364-33c5063a7540?w=600&h=600&fit=crop&q=80",
        is_active: true,
        is_featured: false,
        sort_order: 4,
      },
      {
        name: "Midnight Jasmine",
        description: "An ethereal floral scent that captures the essence of a blooming garden under a starlit summer sky.",
        price: 1800,
        fragrance: "Jasmine Bloom, White Musk, Neroli",
        burn_time: "40–45 hours",
        image_url: "https://images.unsplash.com/photo-1643717714149-f554368b0c4a?w=600&h=600&fit=crop&q=80",
        is_active: true,
        is_featured: false,
        sort_order: 5,
      },
      {
        name: "Bergamot & Cedar",
        description: "Refreshing and crisp. This scent brings the vitality of the Mediterranean coast into your personal sanctuary.",
        price: 2295,
        fragrance: "Italian Bergamot, Himalayan Cedar, Lime",
        burn_time: "45–50 hours",
        image_url: "https://images.unsplash.com/photo-1656437093582-22e3b1ac3604?w=600&h=600&fit=crop&q=80",
        is_active: true,
        is_featured: false,
        sort_order: 6,
      },
      {
        name: "Sandalwood Serenity",
        description: "Our signature blend. Deep, creamy sandalwood notes perfectly balanced for a meditative atmosphere.",
        price: 3280,
        fragrance: "Mysore Sandalwood, Cardamom, Leather",
        burn_time: "55–60 hours",
        image_url: "https://images.unsplash.com/photo-1760804876257-f073f77f2bcf?w=600&h=600&fit=crop&q=80",
        is_active: true,
        is_featured: false,
        sort_order: 7,
      },
    ],
  });

  console.log("✓ Seeded 7 candle products with real images");
}

main().catch(console.error).finally(() => prisma.$disconnect());
