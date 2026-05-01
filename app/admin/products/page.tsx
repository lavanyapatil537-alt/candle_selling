import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  let products: { id: string; name: string; price: { toString(): string }; fragrance: string | null; image_url: string | null; is_active: boolean; is_featured: boolean }[] = [];
  try {
    products = await prisma.product.findMany({ orderBy: [{ sort_order: "asc" }, { created_at: "desc" }] });
  } catch { /* db not configured */ }

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
      <AdminProductsClient products={products} />
    </div>
  );
}
