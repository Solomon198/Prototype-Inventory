export interface DataType {
  _id: string;
  name: string;
  description?: string;
  type: "string" | "number" | "boolean" | "date" | "array" | "object";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Marchant {
  _id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FieldSchema {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

export interface Field {
  _id: string;
  name: string;
  type: DataType;
  merchantId: Marchant;
  moduleId: Module;
  isLabel?: boolean;
  typeSchema?: FieldSchema[];
  createdAt: string;
  updatedAt: string;
}

// Relationship types
export interface EventRule {
  action: string;
  targetField?: string; // Target field in the target module
  sourceField?: string; // Source field from the current module
  value?: string; // Optional - only needed for some actions
  fields?: string[];
  delta?: string;
}

export interface Relationship {
  baseModule: string;
  targetModule: string;
  eventRules?: {
    onCreate?: EventRule[];
    onUpdate?: EventRule[];
    onDelete?: EventRule[];
  };
}

export interface Module {
  _id: string;
  name: string;
  description?: string;
  merchantId: Marchant;
  isActive: boolean;
  relationships?: Relationship[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateDataTypeRequest {
  name: string;
}

export interface CreateMarchantRequest {
  name: string;
}

export interface CreateFieldRequest {
  name: string;
  type: string;
  moduleId: string;
  isLabel?: boolean;
  typeSchema?: FieldSchema[];
}

export interface CreateModuleRequest {
  name: string;
  relationships?: Relationship[];
}

export interface UpdateModuleRequest {
  name?: string;
  relationships?: Relationship[];
}
