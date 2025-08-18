import mongoose, { Document, Schema } from "mongoose";

export interface IMarchants extends Document {
  name: string;
  merchantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const marchantsSchema = new Schema<IMarchants>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    merchantId: {
      type: String,
      required: [true, "Merchant ID is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Marchants = mongoose.model<IMarchants>("marchants", marchantsSchema);
