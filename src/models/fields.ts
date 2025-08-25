import mongoose, { Document, Schema } from "mongoose";

export interface IFields extends Document {
  name: string;
  fieldId: string;
  moduleId: Schema.Types.ObjectId;
  merchantId: Schema.Types.ObjectId;
  type: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isLabel: boolean;
  typeSchema?: Schema.Types.Mixed;
  value?: Schema.Types.Mixed;
}

const fieldsSchema = new Schema<IFields>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    isLabel: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Schema.Types.ObjectId,
      required: [true, "Type ID is required"],
      ref: "dataTypes",
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      required: [true, "Module ID is required"],
      ref: "modules",
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      required: [true, "Merchant ID is required"],
      ref: "marchants",
    },
    fieldId: {
      type: String,
      required: [true, "Field ID is required"],
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
    },
    typeSchema: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Fields = mongoose.model<IFields>("fields", fieldsSchema);
