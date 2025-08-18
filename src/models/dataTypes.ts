import mongoose, { Document, Schema } from "mongoose";

export interface IDataTypes extends Document {
  name: string;
  typeId: string;
}

const dataTypesSchema = new Schema<IDataTypes>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    typeId: {
      type: String,
      required: [true, "Type ID is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const DataTypes = mongoose.model<IDataTypes>("dataTypes", dataTypesSchema);
