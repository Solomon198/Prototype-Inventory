import api from "./api";

export interface ModuleData {
  _id: string;
  moduleId: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const moduleDataApi = {
  // Get all module data for a specific module
  getAll: async (moduleId: string) => {
    const response = await api.get(`/api/data?moduleId=${moduleId}`);
    return response;
  },

  // Get a specific module data by ID
  getById: async (id: string) => {
    const response = await api.get(`/api/data/${id}`);
    return response.data;
  },

  // Create new module data
  create: async (data: { moduleId: string; data: Record<string, any> }) => {
    const response = await api.post("/api/data", data);
    return response.data;
  },

  // Update module data
  update: async (
    id: string,
    data: Partial<{ moduleId: string; data: Record<string, any> }>
  ) => {
    const response = await api.put(`/api/data/${id}`, data);
    return response.data;
  },

  // Delete module data
  delete: async (id: string) => {
    const response = await api.delete(`/api/data/${id}`);
    return response.data;
  },
};
