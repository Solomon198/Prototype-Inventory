import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import type {
  Field,
  DataType,
  Marchant,
  Module,
  CreateFieldRequest,
} from "../types";
import { fieldApi, dataTypeApi, marchantApi, moduleApi } from "../services/api";

const Fields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [marchants, setMarchants] = useState<Marchant[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMarchantFilter, setSelectedMarchantFilter] =
    useState<string>("");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("");
  const [formData, setFormData] = useState<CreateFieldRequest>({
    name: "",
    type: "",
    merchantId: "",
    moduleId: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedMarchantFilter, selectedModuleFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        fieldsResponse,
        dataTypesResponse,
        marchantsResponse,
        modulesResponse,
      ] = await Promise.all([
        fieldApi.getAll({
          ...(selectedMarchantFilter && { merchantId: selectedMarchantFilter }),
          ...(selectedModuleFilter && { moduleId: selectedModuleFilter }),
        }),
        dataTypeApi.getAll(),
        marchantApi.getAll(),
        moduleApi.getAll(),
      ]);

      setFields(fieldsResponse);
      setDataTypes(dataTypesResponse);
      setMarchants(marchantsResponse);
      setModules(modulesResponse);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fieldApi.create(formData);
      setShowModal(false);
      setFormData({
        name: "",
        type: "",
        merchantId: "",
        moduleId: "",
      });
      fetchData();
    } catch (err) {
      setError("Failed to create field");
      console.error("Error creating field:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      try {
        await fieldApi.delete(id);
        fetchData();
      } catch (err) {
        setError("Failed to delete field");
        console.error("Error deleting field:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading fields...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Fields</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Filter by Marchant:
            </label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMarchantFilter}
              onChange={(e) => setSelectedMarchantFilter(e.target.value)}
            >
              <option value="">All Marchants</option>
              {marchants.map((marchant) => (
                <option key={marchant._id} value={marchant._id}>
                  {marchant.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Filter by Module:
            </label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedModuleFilter}
              onChange={(e) => setSelectedModuleFilter(e.target.value)}
            >
              <option value="">All Modules</option>
              {modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} />
            Add Field
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marchant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field) => (
              <tr key={field._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {field.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {field.type.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {field.merchantId.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {field.moduleId?.name || "-"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(field.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                    onClick={() => handleDelete(field._id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Field</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                >
                  <option value="">Select Data Type</option>
                  {dataTypes.map((dataType) => (
                    <option key={dataType._id} value={dataType._id}>
                      {dataType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marchant
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.merchantId}
                  onChange={(e) =>
                    setFormData({ ...formData, merchantId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Marchant</option>
                  {marchants.map((marchant) => (
                    <option key={marchant._id} value={marchant._id}>
                      {marchant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.moduleId}
                  onChange={(e) =>
                    setFormData({ ...formData, moduleId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Module</option>
                  {modules.map((module) => (
                    <option key={module._id} value={module._id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fields;
