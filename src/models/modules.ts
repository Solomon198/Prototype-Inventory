import mongoose, { Document, Schema } from "mongoose";

// Relationship interface
interface IRelationship {
  relationshipId: string;
  baseModule: string;
  targetModule: string;
  eventRules?: {
    onCreate?: Array<{
      action: string;
      targetField?: string;
      value?: string;
    }>;
    onUpdate?: Array<{
      action: string;
      targetField?: string;
      value?: string;
    }>;
    onDelete?: Array<{
      action: string;
      targetField?: string;
      value?: string;
    }>;
  };
}

export interface IModules extends Document {
  name: string;
  merchantId: Schema.Types.ObjectId;
  moduleId: string;
  relationships?: IRelationship[];
  createdAt: Date;
  updatedAt: Date;
}

const relationshipSchema = new Schema<IRelationship>(
  {
    relationshipId: {
      type: String,
      required: [true, "Relationship ID is required"],
      trim: true,
    },
    baseModule: {
      type: String,
      required: [true, "Base module is required"],
      trim: true,
    },
    targetModule: {
      type: String,
      required: [true, "Target module is required"],
      trim: true,
    },
    eventRules: {
      onCreate: [
        {
          action: String,
          targetField: String,
          value: String,
        },
      ],
      onUpdate: [
        {
          action: String,
          targetField: String,
          value: String,
        },
      ],
      onDelete: [
        {
          action: String,
          targetField: String,
          value: String,
        },
      ],
    },
  },
  { _id: false }
);

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
    relationships: {
      type: [relationshipSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Modules = mongoose.model<IModules>("modules", modulesSchema);
