import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  _id?: mongoose.Types.ObjectId;
  product_id?: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document {
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  status: string;
  notes?: string;
  order_items: IOrderItem[];
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product_id: String,
  product_name: { type: String, required: true },
  unit_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    customer_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    total_amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    notes: String,
    order_items: [OrderItemSchema],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

OrderSchema.set("toJSON", {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (Array.isArray(ret.order_items)) {
      ret.order_items = ret.order_items.map((item: any) => {
        const { _id, ...rest } = item;
        return { ...rest, id: _id?.toString() };
      });
    }
    return ret;
  },
});

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
