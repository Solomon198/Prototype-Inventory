import api from "./api";

export interface Module {
  _id: string;
  name: string;
  description?: string;
  merchantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const moduleApi = {
  // Get all modules for a specific merchant
  getAll: async (merchantId: string) => {
    const response = await api.get(`/api/modules?merchantId=${merchantId}`);
    return response;
  },

  // Get a specific module by ID
  getById: async (id: string) => {
    const response = await api.get(`/api/modules/${id}`);
    return response.data;
  },

  // Create a new module
  create: async (data: {
    name: string;
    merchantId: string;
    description?: string;
  }) => {
    const response = await api.post("/api/modules", data);
    return response.data;
  },

  // Update a module
  update: async (
    id: string,
    data: Partial<{ name: string; description: string; isActive: boolean }>
  ) => {
    const response = await api.put(`/api/modules/${id}`, data);
    return response.data;
  },

  // Delete a module
  delete: async (id: string) => {
    const response = await api.delete(`/api/modules/${id}`);
    return response.data;
  },
};
