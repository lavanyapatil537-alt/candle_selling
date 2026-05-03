import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import mongoose from "mongoose";
import Product from "../models/Product";
import { FALLBACK_PRODUCTS } from "../lib/fallback-products";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<")) {
    console.error("Error: MONGODB_URI is not set in .env.local");
    console.error("Add your MongoDB connection string to .env.local:");
    console.error('  MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/lexi-candles"');
    process.exit(1);
  }

  await mongoose.connect(uri);
  await Product.deleteMany({});
  await Product.insertMany(FALLBACK_PRODUCTS.map(({ id: _id, ...rest }) => rest));
  console.log(`Seeded ${FALLBACK_PRODUCTS.length} candle products`);
}

main().catch(console.error).finally(() => mongoose.disconnect());
