import axios from "axios";
import type {
  DataType,
  Marchant,
  Field,
  Module,
  ApiResponse,
  CreateDataTypeRequest,
  CreateMarchantRequest,
  CreateFieldRequest,
  CreateModuleRequest,
} from "../types";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Data Types API
export const dataTypeApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get("/data-types", { params });
    return response.data;
  },

  create: async (data: CreateDataTypeRequest) => {
    const response = await api.post<ApiResponse<DataType>>("/data-types", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateDataTypeRequest>) => {
    const response = await api.put<ApiResponse<DataType>>(
      `/data-types/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/data-types/${id}`
    );
    return response.data;
  },
};

// Marchants API
export const marchantApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get("/marchants", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Marchant>>(`/marchants/${id}`);
    return response.data;
  },

  create: async (data: CreateMarchantRequest) => {
    const response = await api.post<ApiResponse<Marchant>>("/marchants", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateMarchantRequest>) => {
    const response = await api.put<ApiResponse<Marchant>>(
      `/marchants/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/marchants/${id}`
    );
    return response.data;
  },
};

// Fields API
export const fieldApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    marchantId?: string;
    moduleId?: string;
  }) => {
    const response = await api.get("/fields", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Field>>(`/fields/${id}`);
    return response.data;
  },

  create: async (data: CreateFieldRequest) => {
    const response = await api.post<ApiResponse<Field>>("/fields", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateFieldRequest>) => {
    const response = await api.put<ApiResponse<Field>>(`/fields/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/fields/${id}`
    );
    return response.data;
  },
};

// Modules API
export const moduleApi = {
  getAll: async (
    merchantId?: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
    }
  ) => {
    const queryParams = {
      ...params,
      ...(merchantId && { merchantId }),
    };
    const response = await api.get("/modules", {
      params: queryParams,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Module>>(`/modules/${id}`);
    return response.data;
  },

  create: async (data: CreateModuleRequest) => {
    const response = await api.post<ApiResponse<Module>>("/modules", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateModuleRequest>) => {
    const response = await api.put<ApiResponse<Module>>(`/modules/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/modules/${id}`
    );
    return response.data;
  },
};
