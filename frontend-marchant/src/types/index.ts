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

export interface Field {
  _id: string;
  name: string;
  type: DataType;
  merchantId: Marchant;
  moduleId: Module;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id: string;
  name: string;
  description?: string;
  merchantId: Marchant;
  isActive: boolean;
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
  merchantId: string;
  moduleId: string;
}

export interface CreateModuleRequest {
  name: string;
  merchantId: string;
}
