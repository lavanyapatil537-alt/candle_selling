import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product = null;
  try {
    await connectDB();
    product = await Product.findById(params.id).catch(() => null);
  } catch { /* db not configured */ }

  if (!product) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-2 mb-1">
        <Link href="/admin/products" className="text-xs text-lexi-muted hover:text-lexi-gold transition-colors">
          ← Catalog
        </Link>
      </div>
      <h1 className="text-xl font-medium text-lexi-dark mb-1">Edit Product</h1>
      <p className="text-xs text-lexi-muted mb-8">{product.name}</p>

      <div className="bg-white border border-lexi-border p-8">
        <ProductForm
          mode="edit"
          initialData={{
            id: product.id,
            name: product.name,
            description: product.description ?? "",
            price: product.price.toString(),
            fragrance: product.fragrance ?? "",
            burn_time: product.burn_time ?? "",
            image_url: product.image_url ?? "",
            is_active: product.is_active,
            is_featured: product.is_featured,
            sort_order: product.sort_order?.toString() ?? "",
          }}
        />
      </div>
    </div>
  );
}
