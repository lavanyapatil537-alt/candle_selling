import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  let products: { id: string; name: string; price: { toString(): string }; fragrance: string | null; image_url: string | null; is_active: boolean; is_featured: boolean }[] = [];
  let dbError: string | null = null;
  try {
    await connectDB();
    const docs = await Product.find().sort({ sort_order: 1, created_at: -1 });
    products = docs.map((p) => p.toJSON() as unknown as typeof products[number]);
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Database connection failed";
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-lexi-dark">Catalog</h1>
          <p className="text-xs text-lexi-muted mt-1">Manage your artisanal candle collection.</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold flex items-center gap-2">
          + ADD PRODUCT
        </Link>
      </div>
      {dbError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          <strong>Database error:</strong> {dbError}. Check that <code>MONGODB_URI</code> is set in <code>.env.local</code>.
        </div>
      )}
      <AdminProductsClient products={products} />
    </div>
  );
}
