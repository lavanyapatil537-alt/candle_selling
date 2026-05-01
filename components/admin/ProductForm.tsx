"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    price: string;
    fragrance: string;
    burn_time: string;
    image_url: string;
    is_active: boolean;
    is_featured: boolean;
    sort_order: string;
  };
  mode: "create" | "edit";
}

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? "",
    fragrance: initialData?.fragrance ?? "",
    burn_time: initialData?.burn_time ?? "",
    image_url: initialData?.image_url ?? "",
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    sort_order: initialData?.sort_order ?? "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.image_url;
    setUploading(true);
    const data = new FormData();
    data.append("file", imageFile);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    setUploading(false);
    if (!res.ok) throw new Error("Image upload failed");
    const json = await res.json();
    return json.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const image_url = await uploadImage();
      const payload = {
        ...form,
        image_url,
        price: parseFloat(form.price),
        sort_order: form.sort_order !== "" ? parseInt(form.sort_order) : null,
      };

      const res = await fetch(
        mode === "create" ? "/api/products" : `/api/products/${initialData?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/products/${initialData?.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError("Failed to delete product.");
    }
  };

  const inputClass = "w-full border border-lexi-border px-4 py-3 text-sm focus:outline-none focus:border-lexi-gold bg-white";
  const labelClass = "block text-[10px] tracking-widest text-lexi-muted mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Image Upload */}
      <div>
        <label className={labelClass}>PRODUCT IMAGE</label>
        <div className="flex items-start gap-6">
          {imagePreview && (
            <div className="w-24 h-24 border border-lexi-border overflow-hidden flex-shrink-0 bg-lexi-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-lexi-muted file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:tracking-widest file:bg-lexi-dark file:text-white hover:file:bg-lexi-brown file:cursor-pointer"
            />
            <p className="text-xs text-lexi-muted mt-2">JPG, PNG, WEBP — uploaded to Supabase Storage</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className={labelClass}>PRODUCT NAME *</label>
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Rose & Oud"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>DESCRIPTION</label>
        <textarea
          className={inputClass}
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the candle — scent profile, mood, occasion..."
        />
      </div>

      {/* Price + Sort Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>PRICE (₹) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. 799"
            required
          />
        </div>
        <div>
          <label className={labelClass}>SORT ORDER</label>
          <input
            type="number"
            min="0"
            className={inputClass}
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            placeholder="Lower = appears first (leave blank for auto)"
          />
        </div>
      </div>

      {/* Fragrance + Burn Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>FRAGRANCE NOTES</label>
          <input
            className={inputClass}
            value={form.fragrance}
            onChange={(e) => setForm({ ...form, fragrance: e.target.value })}
            placeholder="e.g. Rose, Oud, Musk"
          />
        </div>
        <div>
          <label className={labelClass}>BURN TIME</label>
          <input
            className={inputClass}
            value={form.burn_time}
            onChange={(e) => setForm({ ...form, burn_time: e.target.value })}
            placeholder="e.g. 45–50 hours"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-lexi-cream border border-lexi-border p-5 space-y-4">
        <h3 className="text-[10px] tracking-widest text-lexi-muted font-medium">VISIBILITY & DISPLAY</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? "bg-lexi-gold" : "bg-lexi-border"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <div>
            <span className="text-sm text-lexi-dark font-medium">Active (visible on storefront)</span>
            <p className="text-xs text-lexi-muted">Hidden products won&apos;t appear in the shop or collection pages.</p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.is_featured ? "bg-lexi-gold" : "bg-lexi-border"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_featured ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <div>
            <span className="text-sm text-lexi-dark font-medium">Featured (shown on homepage)</span>
            <p className="text-xs text-lexi-muted">Featured products appear in the &quot;Our Collection&quot; section on the homepage.</p>
          </div>
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-gold px-8 py-3 disabled:opacity-50"
        >
          {uploading ? "UPLOADING..." : saving ? "SAVING..." : mode === "create" ? "ADD PRODUCT" : "SAVE CHANGES"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline px-8 py-3"
        >
          CANCEL
        </button>

        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto text-xs text-red-500 hover:text-red-700 transition disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
        )}
      </div>
    </form>
  );
}
