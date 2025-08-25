import mongoose, { Document, Schema } from "mongoose";

export interface IModuleData extends Document {
  moduleId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const moduleDataSchema = new Schema<IModuleData>(
  {
    moduleId: {
      type: String,
      required: [true, "Module ID is required"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Data is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const ModuleData = mongoose.model<IModuleData>(
  "moduleData",
  moduleDataSchema
);
