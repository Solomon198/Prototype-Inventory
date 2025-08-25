import { useState, useEffect } from "react";
import { Trash2, Edit, Plus, Package, Calendar, User } from "lucide-react";
import { moduleDataApi, type ModuleData } from "../services/moduleDataApi";
import { fieldApi, type Field } from "../services/fieldApi";

interface ModuleDataRendererProps {
  moduleId: string;
  moduleName: string;
}

const ModuleDataRenderer = ({
  moduleId,
  moduleName,
}: ModuleDataRendererProps) => {
  const [moduleData, setModuleData] = useState<ModuleData[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [moduleId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dataResponse, fieldsResponse] = await Promise.all([
        moduleDataApi.getAll(moduleId),
        fieldApi.getAll(moduleId),
      ]);

      setModuleData(dataResponse.data || []);
      setFields(fieldsResponse.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch module data");
      console.error("Error fetching module data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await moduleDataApi.delete(id);
      setModuleData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError("Failed to delete item");
      console.error("Error deleting item:", err);
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    if (typeof value === "string" && value.includes("T")) {
      // Try to format as date
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    return String(value);
  };

  const getFieldType = (fieldName: string): string => {
    const field = fields.find((f) => f.name === fieldName);
    return field?.type.type || "string";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading {moduleName} data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (moduleData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No {moduleName} Data Found
        </h3>
        <p className="text-gray-600">
          No items have been created for this module yet. Create your first item
          to get started.
        </p>
      </div>
    );
  }

  // Get all unique field names from the data
  const allFieldNames = new Set<string>();
  moduleData.forEach((item) => {
    Object.keys(item.data).forEach((key) => allFieldNames.add(key));
  });

  const fieldNamesArray = Array.from(allFieldNames);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {moduleName} Items ({moduleData.length})
          </h3>
          <p className="text-gray-600">
            Manage your {moduleName.toLowerCase()} data
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {fieldNamesArray.map((fieldName) => (
                  <th
                    key={fieldName}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {fieldName}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {moduleData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {fieldNamesArray.map((fieldName) => (
                    <td
                      key={fieldName}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      <div className="flex items-center">
                        {getFieldType(fieldName) === "boolean" && (
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              item.data[fieldName]
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        )}
                        <span className="truncate max-w-xs">
                          {formatValue(item.data[fieldName])}
                        </span>
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // TODO: Implement edit functionality
                          alert("Edit functionality coming soon!");
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModuleDataRenderer;
