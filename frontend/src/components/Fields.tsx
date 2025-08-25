import { useState, useEffect } from "react";
import { Plus, X, Trash2, PlusCircle, MinusCircle } from "lucide-react";
import type {
  Field,
  DataType,
  Module,
  CreateFieldRequest,
  FieldSchema,
} from "../types";
import { fieldApi, dataTypeApi, moduleApi } from "../services/api";

const Fields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("");
  const [formData, setFormData] = useState<CreateFieldRequest>({
    name: "",
    type: "",
    moduleId: "",
    isLabel: false,
  });
  const [showSchemaSection, setShowSchemaSection] = useState(false);
  const [schemaFields, setSchemaFields] = useState<FieldSchema[]>([]);

  useEffect(() => {
    fetchData();
  }, [selectedModuleFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fieldsResponse, dataTypesResponse, modulesResponse] =
        await Promise.all([
          fieldApi.getAll({
            ...(selectedModuleFilter && { moduleId: selectedModuleFilter }),
          }),
          dataTypeApi.getAll(),
          moduleApi.getAll(),
        ]);

      setFields(fieldsResponse);
      setDataTypes(dataTypesResponse);
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
      const submitData = {
        ...formData,
        ...(showSchemaSection &&
          schemaFields.length > 0 && { typeSchema: schemaFields }),
      };
      await fieldApi.create(submitData);
      setShowModal(false);
      setFormData({
        name: "",
        type: "",
        moduleId: "",
        isLabel: false,
      });
      setSchemaFields([]);
      setShowSchemaSection(false);
      fetchData();
    } catch (err) {
      setError("Failed to create field");
      console.error("Error creating field:", err);
    }
  };

  const handleTypeChange = (typeId: string) => {
    setFormData({ ...formData, type: typeId });
    const selectedDataType = dataTypes.find((dt) => dt._id === typeId);
    const isArray = selectedDataType?.name?.toLowerCase() === "array";
    setShowSchemaSection(!!isArray);
    if (!isArray) {
      setSchemaFields([]);
    }
  };

  const addSchemaField = () => {
    setSchemaFields([
      ...schemaFields,
      {
        name: "",
        type: "",
        required: false,
      },
    ]);
  };

  const removeSchemaField = (index: number) => {
    setSchemaFields(schemaFields.filter((_, i) => i !== index));
  };

  const updateSchemaField = (index: number, field: Partial<FieldSchema>) => {
    const updatedFields = [...schemaFields];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setSchemaFields(updatedFields);
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
                Schema
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Is Label
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
                  {field.typeSchema && field.typeSchema.length > 0 ? (
                    <div className="text-xs">
                      <span className="text-gray-500">Fields: </span>
                      {field.typeSchema.map((schema, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 px-1 rounded mr-1"
                        >
                          {schema.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {field.moduleId?.name || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {field.isLabel ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No
                    </span>
                  )}
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
                  onChange={(e) => handleTypeChange(e.target.value)}
                  required
                >
                  <option value="">Select Data Type</option>
                  <optgroup label="Basic Data Types">
                    {dataTypes.map((dataType) => (
                      <option key={dataType._id} value={dataType._id}>
                        {dataType.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Modules">
                    {modules.map((module) => (
                      <option key={module._id} value={module._id}>
                        {module.name}
                      </option>
                    ))}
                  </optgroup>
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

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isLabel"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.isLabel}
                  onChange={(e) =>
                    setFormData({ ...formData, isLabel: e.target.checked })
                  }
                />
                <div>
                  <label
                    htmlFor="isLabel"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Use as Module Label
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    This field will be used as the display name for this module
                    in lists and relationships
                  </p>
                </div>
              </div>

              {showSchemaSection && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Array Item Schema
                    </h4>
                    <button
                      type="button"
                      onClick={addSchemaField}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <PlusCircle size={16} />
                      Add Field
                    </button>
                  </div>

                  {schemaFields.length === 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                      Define the structure for each object in the array. Add
                      fields to specify what properties each array item should
                      have.
                    </p>
                  )}

                  <div className="space-y-3">
                    {schemaFields.map((schemaField, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Field {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSchemaField(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <MinusCircle size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Field Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={schemaField.name}
                              onChange={(e) =>
                                updateSchemaField(index, {
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., title, price"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Data Type
                            </label>
                            <select
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={schemaField.type}
                              onChange={(e) =>
                                updateSchemaField(index, {
                                  type: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Type</option>
                              <optgroup label="Basic Data Types">
                                {dataTypes.map((dataType) => (
                                  <option
                                    key={dataType._id}
                                    value={dataType._id}
                                  >
                                    {dataType.name}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="Modules">
                                {modules.map((module) => (
                                  <option key={module._id} value={module._id}>
                                    {module.name}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={schemaField.required || false}
                              onChange={(e) =>
                                updateSchemaField(index, {
                                  required: e.target.checked,
                                })
                              }
                            />
                            <span className="text-xs text-gray-600">
                              Required field
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      name: "",
                      type: "",
                      moduleId: "",
                      isLabel: false,
                    });
                    setSchemaFields([]);
                    setShowSchemaSection(false);
                  }}
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
