import { useState, useEffect } from "react";
import { Plus, Save, X } from "lucide-react";
import { fieldApi, type Field } from "../services/fieldApi";
import { moduleDataApi } from "../services/moduleDataApi";

interface DynamicFormProps {
  moduleId: string;
  moduleName: string;
  onClose: () => void;
}

interface FormData {
  [key: string]: any;
}

const DynamicForm = ({ moduleId, onClose, moduleName }: DynamicFormProps) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFields();
  }, [moduleId]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await fieldApi.getAll(moduleId);
      setFields(response.data || []);

      // Initialize form data with empty values
      const initialData: FormData = {};
      (response.data || []).forEach((field) => {
        initialData[field._id] = getDefaultValue(field.type.type);
      });
      setFormData(initialData);

      setError(null);
    } catch (err) {
      setError("Failed to fetch fields");
      console.error("Error fetching fields:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultValue = (type: string): any => {
    switch (type) {
      case "string":
        return "";
      case "number":
        return 0;
      case "boolean":
        return false;
      case "date":
        return "";
      case "array":
        return [];
      case "object":
        return {};
      default:
        return "";
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Transform formData to use field names as keys instead of IDs
      const transformedData: { [key: string]: any } = {};
      fields.forEach((field: Field) => {
        transformedData[field.name] = formData[field._id];
      });

      // Submit to moduleData API
      await moduleDataApi.create({
        moduleId,
        data: transformedData,
      });

      alert("Item created successfully!");
      onClose();
    } catch (err) {
      setError("Failed to create item");
      console.error("Error creating item:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    const { type } = field;

    switch (type.type) {
      case "string":
        return (
          <input
            type="text"
            value={formData[field._id] || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={formData[field._id] || ""}
            onChange={(e) =>
              handleInputChange(field._id, parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData[field._id] || false}
              onChange={(e) => handleInputChange(field._id, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Yes</span>
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            value={formData[field._id] || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case "array":
        return (
          <textarea
            value={
              Array.isArray(formData[field._id])
                ? formData[field._id].join(", ")
                : ""
            }
            onChange={(e) =>
              handleInputChange(
                field._id,
                e.target.value.split(",").map((item) => item.trim())
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${field.name.toLowerCase()} (comma-separated)`}
            rows={3}
          />
        );

      case "object":
        return (
          <textarea
            value={
              typeof formData[field._id] === "object"
                ? JSON.stringify(formData[field._id], null, 2)
                : ""
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleInputChange(field._id, parsed);
              } catch {
                handleInputChange(field._id, e.target.value);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder={`Enter ${field.name.toLowerCase()} (JSON format)`}
            rows={4}
          />
        );

      default:
        return (
          <input
            type="text"
            value={formData[field._id] || ""}
            onChange={(e) => handleInputChange(field._id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form fields...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Create New {moduleName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {fields.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Fields Found
            </h3>
            <p className="text-gray-600">
              This module doesn't have any fields defined yet. Please add fields
              to this module first.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field._id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.name}
                </label>
                {renderField(field)}
                {field.type.description && (
                  <p className="mt-1 text-xs text-gray-500">
                    {field.type.description}
                  </p>
                )}
              </div>
            ))}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create {moduleName}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
