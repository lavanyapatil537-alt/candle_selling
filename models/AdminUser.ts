import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminUser extends Document {
  email: string;
  password_hash: string;
  name?: string;
  last_login_at?: Date;
  created_at: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    name: String,
    last_login_at: Date,
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);

export default AdminUser;
