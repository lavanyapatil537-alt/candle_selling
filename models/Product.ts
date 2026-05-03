import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  fragrance?: string;
  burn_time?: string;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order?: number;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    fragrance: String,
    burn_time: String,
    image_url: String,
    is_active: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
    sort_order: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ProductSchema.set("toJSON", {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
