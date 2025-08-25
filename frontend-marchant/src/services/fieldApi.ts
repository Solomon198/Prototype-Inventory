import api from "./api";

export interface DataType {
  _id: string;
  name: string;
  description?: string;
  type: "string" | "number" | "boolean" | "date" | "array" | "object";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Field {
  _id: string;
  name: string;
  type: DataType;
  merchantId: string;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const fieldApi = {
  // Get all fields for a specific module
  getAll: async (moduleId: string) => {
    const response = await api.get(`/api/fields?moduleId=${moduleId}`);
    return response;
  },

  // Get a specific field by ID
  getById: async (id: string) => {
    const response = await api.get(`/api/fields/${id}`);
    return response.data;
  },

  // Create a new field
  create: async (data: {
    name: string;
    type: string;
    merchantId: string;
    moduleId: string;
  }) => {
    const response = await api.post("/api/fields", data);
    return response.data;
  },

  // Update a field
  update: async (
    id: string,
    data: Partial<{ name: string; type: string; moduleId: string }>
  ) => {
    const response = await api.put(`/api/fields/${id}`, data);
    return response.data;
  },

  // Delete a field
  delete: async (id: string) => {
    const response = await api.delete(`/api/fields/${id}`);
    return response.data;
  },
};
