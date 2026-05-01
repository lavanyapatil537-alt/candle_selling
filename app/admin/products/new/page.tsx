import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <Link href="/admin/products" className="text-xs text-lexi-muted hover:text-lexi-gold transition-colors">
          ← Catalog
        </Link>
      </div>
      <h1 className="text-xl font-medium text-lexi-dark mb-1">Add Product</h1>
      <p className="text-xs text-lexi-muted mb-8">Add a new candle to your collection.</p>

      <div className="bg-white border border-lexi-border p-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
