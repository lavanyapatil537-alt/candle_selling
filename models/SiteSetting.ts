import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSetting extends Document {
  setting_key: string;
  setting_value?: string;
  updated_at: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    setting_key: { type: String, required: true, unique: true },
    setting_value: String,
  },
  { timestamps: { createdAt: false, updatedAt: "updated_at" } }
);

const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);

export default SiteSetting;
