import mongoose, { Document, Schema } from "mongoose";

export interface IModules extends Document {
  name: string;
  merchantId: Schema.Types.ObjectId;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
}

const modulesSchema = new Schema<IModules>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      required: [true, "Merchant ID is required"],
      ref: "marchants",
    },
    moduleId: {
      type: String,
      required: [true, "Module ID is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Modules = mongoose.model<IModules>("modules", modulesSchema);
