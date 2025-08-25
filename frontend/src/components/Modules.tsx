import { useState, useEffect } from "react";
import { Plus, X, Trash2, Link, Settings, Edit } from "lucide-react";
import type {
  Module,
  CreateModuleRequest,
  UpdateModuleRequest,
  Relationship,
  EventRule,
  Field,
  DataType,
} from "../types";
import { moduleApi, fieldApi, dataTypeApi } from "../services/api";

const Modules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [targetModuleFields, setTargetModuleFields] = useState<Field[]>([]);
  const [currentModuleFields, setCurrentModuleFields] = useState<Field[]>([]);
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [selectedArrayField, setSelectedArrayField] = useState<Field | null>(
    null
  );
  const [selectedSourceFieldIds, setSelectedSourceFieldIds] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);
  const [showEditRelationships, setShowEditRelationships] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [expandedRelationships, setExpandedRelationships] = useState<number[]>(
    []
  );
  const [formData, setFormData] = useState<CreateModuleRequest>({
    name: "",
    relationships: [],
  });
  const [editFormData, setEditFormData] = useState<UpdateModuleRequest>({
    name: "",
    relationships: [],
  });
  const [currentRelationship, setCurrentRelationship] = useState<Relationship>({
    baseModule: "",
    targetModule: "",
    eventRules: {
      onCreate: [],
      onUpdate: [],
      onDelete: [],
    },
  });
  const [currentEditRelationship, setCurrentEditRelationship] =
    useState<Relationship>({
      baseModule: "",
      targetModule: "",
      eventRules: {
        onCreate: [],
        onUpdate: [],
        onDelete: [],
      },
    });

  // Helper functions for managing source field selections per event rule
  const getSourceFieldKey = (eventType: string, index: number) =>
    `${eventType}-${index}`;

  const getSelectedSourceFieldId = (eventType: string, index: number) => {
    return selectedSourceFieldIds[getSourceFieldKey(eventType, index)] || "";
  };

  const setSelectedSourceFieldId = (
    eventType: string,
    index: number,
    fieldId: string
  ) => {
    const key = getSourceFieldKey(eventType, index);
    setSelectedSourceFieldIds((prev) => ({
      ...prev,
      [key]: fieldId,
    }));
  };

  // Predefined actions for dropdown
  const availableActions = [
    "increment",
    "decrement",
    "set",
    "multiply",
    "divide",
    "snapshot",
    "cascadeDelete",
    "validate",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  // Debug useEffect to monitor editFormData changes
  useEffect(() => {
    console.log("editFormData changed:", editFormData);
    console.log("editFormData.relationships:", editFormData.relationships);
  }, [editFormData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [modulesResponse, dataTypesResponse] = await Promise.all([
        moduleApi.getAll(),
        dataTypeApi.getAll(),
      ]);
      setModules(modulesResponse);
      setAllModules(modulesResponse); // Store all modules for dropdown
      setDataTypes(dataTypesResponse);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTargetModuleFields = async (moduleId: string) => {
    try {
      const fieldsResponse = await fieldApi.getAll({ moduleId });
      setTargetModuleFields(fieldsResponse);
    } catch (err) {
      console.error("Error fetching target module fields:", err);
      setTargetModuleFields([]);
    }
  };

  const fetchCurrentModuleFields = async (moduleId: string) => {
    try {
      const fieldsResponse = await fieldApi.getAll({ moduleId });
      setCurrentModuleFields(fieldsResponse);
    } catch (err) {
      console.error("Error fetching current module fields:", err);
      setCurrentModuleFields([]);
    }
  };

  const handleSourceFieldChange = (
    eventType: "onCreate" | "onUpdate" | "onDelete",
    index: number,
    fieldId: string
  ) => {
    setSelectedSourceFieldId(eventType, index, fieldId);
    const selectedField = currentModuleFields.find((f) => f._id === fieldId);
    if (selectedField) {
      // Check if the field type is an array
      const fieldDataType = dataTypes.find(
        (dt) => dt._id === selectedField.type._id
      );
      if (fieldDataType?.name?.toLowerCase() === "array") {
        setSelectedArrayField(selectedField);
        // Clear the sourceField when switching to array type
        updateEventRule(eventType, index, "sourceField", "");
      } else {
        setSelectedArrayField(null);
        // Set the field name as the source field
        updateEventRule(eventType, index, "sourceField", selectedField.name);
      }
    } else {
      setSelectedArrayField(null);
      updateEventRule(eventType, index, "sourceField", "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Sending create data:", formData);
      console.log("Relationships:", formData.relationships);
      const createdModule = await moduleApi.create(formData);

      // If there are relationships, we need to update them with the base module ID
      if (formData.relationships && formData.relationships.length > 0) {
        const relationshipsWithBaseModule = formData.relationships.map(
          (relationship) => ({
            ...relationship,
            baseModule: createdModule.data._id,
          })
        );

        // Update the module with the relationships that have the correct base module ID
        await moduleApi.update(createdModule.data._id, {
          ...formData,
          relationships: relationshipsWithBaseModule,
        });
      }

      setShowModal(false);
      setFormData({
        name: "",
        relationships: [],
      });
      setShowRelationships(false);
      fetchData();
    } catch (err) {
      setError("Failed to create module");
      console.error("Error creating module:", err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    try {
      await moduleApi.update(editingModule._id, editFormData);
      setShowEditModal(false);
      setEditingModule(null);
      setEditFormData({
        name: "",
        relationships: [],
      });
      setShowEditRelationships(false);
      fetchData();
    } catch (err) {
      setError("Failed to update module");
      console.error("Error updating module:", err);
    }
  };

  const handleEdit = (module: Module) => {
    console.log("=== EDIT MODULE DEBUG ===");
    console.log("Editing module:", module);
    console.log("Module relationships:", module.relationships);
    console.log("Module relationships length:", module.relationships?.length);
    console.log("Module relationships type:", typeof module.relationships);

    setEditingModule(module);
    setEditFormData({
      name: module.name,
      relationships: module.relationships || [],
    });
    setCurrentEditRelationship({
      baseModule: "",
      targetModule: "",
      eventRules: {
        onCreate: [],
        onUpdate: [],
        onDelete: [],
      },
    });
    setShowEditModal(true);
    // Fetch current module fields for source field selection
    fetchCurrentModuleFields(module._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        await moduleApi.delete(id);
        fetchData();
      } catch (err) {
        setError("Failed to delete module");
        console.error("Error deleting module:", err);
      }
    }
  };

  const addRelationship = () => {
    if (currentRelationship.targetModule) {
      setFormData({
        ...formData,
        relationships: [...(formData.relationships || []), currentRelationship],
      });
      setCurrentRelationship({
        baseModule: "",
        targetModule: "",
        eventRules: {
          onCreate: [],
          onUpdate: [],
          onDelete: [],
        },
      });
      setTargetModuleFields([]);
    }
  };

  const addEditRelationship = () => {
    console.log("=== ADD EDIT RELATIONSHIP DEBUG ===");
    console.log("currentEditRelationship:", currentEditRelationship);
    console.log(
      "currentEditRelationship.targetModule:",
      currentEditRelationship.targetModule
    );
    console.log("editingModule:", editingModule);
    console.log("editingModule._id:", editingModule?._id);

    if (currentEditRelationship.targetModule && editingModule) {
      // Set the base module to the current editing module's ID
      const relationshipWithBaseModule = {
        ...currentEditRelationship,
        baseModule: editingModule._id,
      };

      console.log("Adding relationship:", relationshipWithBaseModule);

      // Use functional update to ensure we have the latest state
      setEditFormData((prevEditFormData) => {
        console.log("Previous editFormData:", prevEditFormData);
        console.log("Previous relationships:", prevEditFormData.relationships);

        const newEditFormData = {
          ...prevEditFormData,
          relationships: [
            ...(prevEditFormData.relationships || []),
            relationshipWithBaseModule,
          ],
        };

        console.log(
          "New editFormData relationships:",
          newEditFormData.relationships
        );
        return newEditFormData;
      });

      setCurrentEditRelationship({
        baseModule: "",
        targetModule: "",
        eventRules: {
          onCreate: [],
          onUpdate: [],
          onDelete: [],
        },
      });
      setTargetModuleFields([]);
    } else {
      console.log(
        "Cannot add relationship - missing targetModule or editingModule"
      );
      console.log(
        "targetModule exists:",
        !!currentEditRelationship.targetModule
      );
      console.log("editingModule exists:", !!editingModule);
    }
  };

  const removeRelationship = (index: number) => {
    const updatedRelationships =
      formData.relationships?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      relationships: updatedRelationships,
    });
  };

  const removeEditRelationship = (index: number) => {
    console.log("Removing relationship at index:", index);

    setEditFormData((prevEditFormData) => {
      console.log("Current relationships:", prevEditFormData.relationships);

      const updatedRelationships =
        prevEditFormData.relationships?.filter((_, i) => i !== index) || [];

      console.log("Updated relationships:", updatedRelationships);

      return {
        ...prevEditFormData,
        relationships: updatedRelationships,
      };
    });
  };

  const addEventRule = (eventType: "onCreate" | "onUpdate" | "onDelete") => {
    const newRule: EventRule = {
      action: "",
      targetField: "",
      sourceField: "",
    };

    setCurrentRelationship({
      ...currentRelationship,
      eventRules: {
        ...currentRelationship.eventRules,
        [eventType]: [
          ...(currentRelationship.eventRules?.[eventType] || []),
          newRule,
        ],
      },
    });
  };

  const addEditEventRule = (
    eventType: "onCreate" | "onUpdate" | "onDelete"
  ) => {
    const newRule: EventRule = {
      action: "",
      targetField: "",
      sourceField: "",
    };

    setCurrentEditRelationship({
      ...currentEditRelationship,
      eventRules: {
        ...currentEditRelationship.eventRules,
        [eventType]: [
          ...(currentEditRelationship.eventRules?.[eventType] || []),
          newRule,
        ],
      },
    });
  };

  const updateEventRule = (
    eventType: "onCreate" | "onUpdate" | "onDelete",
    index: number,
    field: keyof EventRule,
    value: string
  ) => {
    const updatedRules = [
      ...(currentRelationship.eventRules?.[eventType] || []),
    ];
    updatedRules[index] = { ...updatedRules[index], [field]: value };

    setCurrentRelationship({
      ...currentRelationship,
      eventRules: {
        ...currentRelationship.eventRules,
        [eventType]: updatedRules,
      },
    });
  };

  const updateEditEventRule = (
    eventType: "onCreate" | "onUpdate" | "onDelete",
    index: number,
    field: keyof EventRule,
    value: string
  ) => {
    const updatedRules = [
      ...(currentEditRelationship.eventRules?.[eventType] || []),
    ];
    updatedRules[index] = { ...updatedRules[index], [field]: value };

    setCurrentEditRelationship({
      ...currentEditRelationship,
      eventRules: {
        ...currentEditRelationship.eventRules,
        [eventType]: updatedRules,
      },
    });
  };

  const removeEventRule = (
    eventType: "onCreate" | "onUpdate" | "onDelete",
    index: number
  ) => {
    const updatedRules =
      currentRelationship.eventRules?.[eventType]?.filter(
        (_, i) => i !== index
      ) || [];

    // Clean up the source field selection for this rule
    const key = getSourceFieldKey(eventType, index);
    setSelectedSourceFieldIds((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });

    setCurrentRelationship({
      ...currentRelationship,
      eventRules: {
        ...currentRelationship.eventRules,
        [eventType]: updatedRules,
      },
    });
  };

  const removeEditEventRule = (
    eventType: "onCreate" | "onUpdate" | "onDelete",
    index: number
  ) => {
    const updatedRules =
      currentEditRelationship.eventRules?.[eventType]?.filter(
        (_, i) => i !== index
      ) || [];

    // Clean up the source field selection for this rule
    const key = getSourceFieldKey(eventType, index);
    setSelectedSourceFieldIds((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });

    setCurrentEditRelationship({
      ...currentEditRelationship,
      eventRules: {
        ...currentEditRelationship.eventRules,
        [eventType]: updatedRules,
      },
    });
  };

  const handleTargetModuleChange = (moduleId: string) => {
    setCurrentRelationship({
      ...currentRelationship,
      targetModule: moduleId,
    });
    if (moduleId) {
      fetchTargetModuleFields(moduleId);
    } else {
      setTargetModuleFields([]);
    }
  };

  const handleEditTargetModuleChange = (moduleId: string) => {
    console.log("=== TARGET MODULE CHANGE DEBUG ===");
    console.log("Selected target module ID:", moduleId);
    console.log("Previous currentEditRelationship:", currentEditRelationship);

    setCurrentEditRelationship({
      ...currentEditRelationship,
      targetModule: moduleId,
    });

    if (moduleId) {
      fetchTargetModuleFields(moduleId);
    } else {
      setTargetModuleFields([]);
    }
  };

  // Function to handle target field selection and generate reference
  const handleTargetFieldChange = (
    eventType: "onCreate" | "onUpdate" | "onDelete",
    index: number,
    fieldId: string
  ) => {
    if (fieldId && currentRelationship.targetModule) {
      // Generate reference: $moduleId-$fieldId
      const reference = `$${currentRelationship.targetModule}-$${fieldId}`;
      updateEventRule(eventType, index, "targetField", reference);
    } else {
      updateEventRule(eventType, index, "targetField", "");
    }
  };

  // Function to handle edit target field selection and generate reference
  const handleEditTargetFieldChange = (
    eventType: "onCreate" | "onUpdate" | "onDelete",
    index: number,
    fieldId: string
  ) => {
    if (fieldId && currentEditRelationship.targetModule) {
      // Generate reference: $moduleId-$fieldId
      const reference = `$${currentEditRelationship.targetModule}-$${fieldId}`;
      updateEditEventRule(eventType, index, "targetField", reference);
    } else {
      updateEditEventRule(eventType, index, "targetField", "");
    }
  };

  const toggleRelationshipExpansion = (index: number) => {
    setExpandedRelationships((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const removeExistingRelationshipRule = (
    relationshipIndex: number,
    eventType: "onCreate" | "onUpdate" | "onDelete",
    ruleIndex: number
  ) => {
    const updatedRelationships = [...(editFormData.relationships || [])];
    const relationship = updatedRelationships[relationshipIndex];
    if (relationship.eventRules?.[eventType]) {
      relationship.eventRules[eventType] = relationship.eventRules[
        eventType
      ]?.filter((_, i) => i !== ruleIndex);
      setEditFormData({
        ...editFormData,
        relationships: updatedRelationships,
      });
    }
  };

  const addExistingRelationshipRule = (
    relationshipIndex: number,
    eventType: "onCreate" | "onUpdate" | "onDelete"
  ) => {
    const updatedRelationships = [...(editFormData.relationships || [])];
    const relationship = updatedRelationships[relationshipIndex];
    if (!relationship.eventRules) {
      relationship.eventRules = {};
    }
    if (!relationship.eventRules[eventType]) {
      relationship.eventRules[eventType] = [];
    }
    relationship.eventRules[eventType]?.push({
      action: "",
      targetField: "",
      sourceField: "",
    });
    setEditFormData({
      ...editFormData,
      relationships: updatedRelationships,
    });
  };

  const updateExistingRelationshipRule = (
    relationshipIndex: number,
    eventType: "onCreate" | "onUpdate" | "onDelete",
    ruleIndex: number,
    field: keyof EventRule,
    value: string
  ) => {
    const updatedRelationships = [...(editFormData.relationships || [])];
    const relationship = updatedRelationships[relationshipIndex];
    if (relationship.eventRules?.[eventType]?.[ruleIndex]) {
      relationship.eventRules[eventType]![ruleIndex] = {
        ...relationship.eventRules[eventType]![ruleIndex],
        [field]: value,
      };
      setEditFormData({
        ...editFormData,
        relationships: updatedRelationships,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading modules...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Modules</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={() => {
            setShowModal(true);
            // Fetch current module fields when creating a new module
            // We'll need to get the current module ID from context or props
          }}
        >
          <Plus size={16} />
          Add Module
        </button>
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
                Relationships
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
            {modules.map((module) => (
              <tr key={module._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {module.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {module.relationships?.length || 0} relationships
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(module.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      onClick={() => handleEdit(module)}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      onClick={() => handleDelete(module._id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Module Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Module
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowModal(false);
                  setShowRelationships(false);
                  setFormData({ name: "", relationships: [] });
                  setSelectedSourceFieldIds({});
                  setSelectedArrayField(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module Name
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

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                    <Link size={16} />
                    Relationships
                  </h4>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                    onClick={() => setShowRelationships(!showRelationships)}
                  >
                    {showRelationships ? "Hide" : "Show"} Relationships
                  </button>
                </div>

                {showRelationships && (
                  <div className="space-y-4">
                    {/* Existing Relationships */}
                    {formData.relationships &&
                      formData.relationships.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-2">
                            Defined Relationships:
                          </h5>
                          {formData.relationships.map((rel, index) => {
                            const targetModule = allModules.find(
                              (m) => m._id === rel.targetModule
                            );
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white p-2 rounded mb-2"
                              >
                                <span className="text-sm">
                                  {rel.baseModule || formData.name} →{" "}
                                  {targetModule?.name || rel.targetModule}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeRelationship(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {/* Add New Relationship */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-3">
                        Add New Relationship
                      </h5>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Module
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={currentRelationship.targetModule}
                          onChange={(e) =>
                            handleTargetModuleChange(e.target.value)
                          }
                        >
                          <option value="">Select a module</option>
                          {allModules.map((module) => (
                            <option key={module._id} value={module._id}>
                              {module.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Event Rules */}
                      <div className="space-y-4">
                        <h6 className="font-medium text-gray-600 flex items-center gap-2">
                          <Settings size={14} />
                          Event Rules
                        </h6>

                        {(["onCreate", "onUpdate", "onDelete"] as const).map(
                          (eventType) => (
                            <div
                              key={eventType}
                              className="border border-gray-200 rounded p-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {eventType.replace("on", "On ")}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addEventRule(eventType)}
                                  className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  + Add Rule
                                </button>
                              </div>

                              {currentRelationship.eventRules?.[eventType]?.map(
                                (rule, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-50 p-2 rounded mb-2"
                                  >
                                    <div
                                      className={`grid gap-2 ${
                                        eventType === "onCreate"
                                          ? "grid-cols-1 md:grid-cols-2"
                                          : "grid-cols-1 md:grid-cols-2"
                                      }`}
                                    >
                                      <select
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={rule.action}
                                        onChange={(e) =>
                                          updateEventRule(
                                            eventType,
                                            index,
                                            "action",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select Action</option>
                                        {availableActions.map((action) => (
                                          <option key={action} value={action}>
                                            {action}
                                          </option>
                                        ))}
                                      </select>
                                      <select
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={
                                          rule.targetField
                                            ? rule.targetField.split("-")[1] ||
                                              ""
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleTargetFieldChange(
                                            eventType,
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Target Field</option>
                                        {targetModuleFields.map((field) => (
                                          <option
                                            key={field._id}
                                            value={field._id}
                                          >
                                            {field.name}
                                          </option>
                                        ))}
                                      </select>
                                      <div className="space-y-1">
                                        <select
                                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                          value={
                                            rule.sourceField
                                              ? rule.sourceField.split(
                                                  "-"
                                                )[1] ||
                                                getSelectedSourceFieldId(
                                                  eventType,
                                                  index
                                                )
                                              : getSelectedSourceFieldId(
                                                  eventType,
                                                  index
                                                )
                                          }
                                          onChange={(e) =>
                                            handleSourceFieldChange(
                                              eventType,
                                              index,
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Source Field</option>
                                          {currentModuleFields.map((field) => (
                                            <option
                                              key={field._id}
                                              value={field._id}
                                            >
                                              {field.name}
                                            </option>
                                          ))}
                                        </select>
                                        {selectedArrayField &&
                                          selectedArrayField.typeSchema &&
                                          selectedArrayField.typeSchema.length >
                                            0 && (
                                            <select
                                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                              value={
                                                rule.sourceField?.replace(
                                                  "item.",
                                                  ""
                                                ) || ""
                                              }
                                              onChange={(e) =>
                                                updateEventRule(
                                                  eventType,
                                                  index,
                                                  "sourceField",
                                                  `item.${e.target.value}`
                                                )
                                              }
                                            >
                                              <option value="">
                                                Select Array Field
                                              </option>
                                              {selectedArrayField.typeSchema.map(
                                                (schemaField) => (
                                                  <option
                                                    key={schemaField.name}
                                                    value={schemaField.name}
                                                  >
                                                    {schemaField.name}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeEventRule(eventType, index)
                                        }
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={addRelationship}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        disabled={!currentRelationship.targetModule}
                      >
                        Add Relationship
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setShowModal(false);
                    setShowRelationships(false);
                    setFormData({ name: "", relationships: [] });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Module Modal */}
      {showEditModal && editingModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Module: {editingModule.name}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowEditModal(false);
                  setShowEditRelationships(false);
                  setEditingModule(null);
                  setEditFormData({ name: "", relationships: [] });
                  setSelectedSourceFieldIds({});
                  setSelectedArrayField(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editFormData.name || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                    <Link size={16} />
                    Relationships
                  </h4>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                    onClick={() =>
                      setShowEditRelationships(!showEditRelationships)
                    }
                  >
                    {showEditRelationships ? "Hide" : "Show"} Relationships
                  </button>
                </div>

                {showEditRelationships && (
                  <div className="space-y-4">
                    {/* Existing Relationships */}
                    {editFormData.relationships &&
                      editFormData.relationships.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-2">
                            Current Relationships:
                          </h5>
                          {editFormData.relationships.map((rel, index) => {
                            const targetModule = allModules.find(
                              (m) => m._id === rel.targetModule
                            );
                            const isExpanded =
                              expandedRelationships.includes(index);

                            return (
                              <div
                                key={index}
                                className="bg-white rounded mb-2"
                              >
                                <div className="flex items-center justify-between p-2">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleRelationshipExpansion(index)
                                      }
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      {isExpanded ? "▼" : "▶"}
                                    </button>
                                    <span className="text-sm">
                                      {rel.baseModule || editFormData.name} →{" "}
                                      {targetModule?.name || rel.targetModule}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeEditRelationship(index)
                                    }
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>

                                {isExpanded && (
                                  <div className="p-3 border-t bg-gray-50">
                                    <div className="space-y-4">
                                      <h6 className="font-medium text-gray-600 flex items-center gap-2">
                                        <Settings size={14} />
                                        Event Rules
                                      </h6>

                                      {(
                                        [
                                          "onCreate",
                                          "onUpdate",
                                          "onDelete",
                                        ] as const
                                      ).map((eventType) => (
                                        <div
                                          key={eventType}
                                          className="border border-gray-200 rounded p-3"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                              {eventType.replace("on", "On ")}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                addExistingRelationshipRule(
                                                  index,
                                                  eventType
                                                )
                                              }
                                              className="text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                              + Add Rule
                                            </button>
                                          </div>

                                          {rel.eventRules?.[eventType]?.map(
                                            (rule, ruleIndex) => (
                                              <div
                                                key={ruleIndex}
                                                className="bg-white p-2 rounded mb-2"
                                              >
                                                <div
                                                  className={`grid gap-2 ${
                                                    eventType === "onCreate"
                                                      ? "grid-cols-1 md:grid-cols-3"
                                                      : "grid-cols-1 md:grid-cols-4"
                                                  }`}
                                                >
                                                  <select
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    value={rule.action}
                                                    onChange={(e) =>
                                                      updateExistingRelationshipRule(
                                                        index,
                                                        eventType,
                                                        ruleIndex,
                                                        "action",
                                                        e.target.value
                                                      )
                                                    }
                                                  >
                                                    <option value="">
                                                      Select Action
                                                    </option>
                                                    {availableActions.map(
                                                      (action) => (
                                                        <option
                                                          key={action}
                                                          value={action}
                                                        >
                                                          {action}
                                                        </option>
                                                      )
                                                    )}
                                                  </select>
                                                  <select
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    value={
                                                      rule.targetField || ""
                                                    }
                                                    onChange={(e) =>
                                                      updateExistingRelationshipRule(
                                                        index,
                                                        eventType,
                                                        ruleIndex,
                                                        "targetField",
                                                        e.target.value
                                                      )
                                                    }
                                                  >
                                                    <option value="">
                                                      Target Field
                                                    </option>
                                                    {targetModuleFields.map(
                                                      (field) => (
                                                        <option
                                                          key={field._id}
                                                          value={field._id}
                                                        >
                                                          {field.name}
                                                        </option>
                                                      )
                                                    )}
                                                  </select>
                                                  <div className="space-y-1">
                                                    <select
                                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                      value={getSelectedSourceFieldId(
                                                        eventType,
                                                        ruleIndex
                                                      )}
                                                      onChange={(e) => {
                                                        setSelectedSourceFieldId(
                                                          eventType,
                                                          ruleIndex,
                                                          e.target.value
                                                        );
                                                        const selectedField =
                                                          currentModuleFields.find(
                                                            (f) =>
                                                              f._id ===
                                                              e.target.value
                                                          );
                                                        if (selectedField) {
                                                          const fieldDataType =
                                                            dataTypes.find(
                                                              (dt) =>
                                                                dt._id ===
                                                                selectedField
                                                                  .type._id
                                                            );
                                                          if (
                                                            fieldDataType?.name?.toLowerCase() ===
                                                            "array"
                                                          ) {
                                                            setSelectedArrayField(
                                                              selectedField
                                                            );
                                                            updateExistingRelationshipRule(
                                                              index,
                                                              eventType,
                                                              ruleIndex,
                                                              "sourceField",
                                                              ""
                                                            );
                                                          } else {
                                                            setSelectedArrayField(
                                                              null
                                                            );
                                                            updateExistingRelationshipRule(
                                                              index,
                                                              eventType,
                                                              ruleIndex,
                                                              "sourceField",
                                                              selectedField.name
                                                            );
                                                          }
                                                        } else {
                                                          setSelectedArrayField(
                                                            null
                                                          );
                                                          updateExistingRelationshipRule(
                                                            index,
                                                            eventType,
                                                            ruleIndex,
                                                            "sourceField",
                                                            ""
                                                          );
                                                        }
                                                      }}
                                                    >
                                                      <option value="">
                                                        Source Field
                                                      </option>
                                                      {currentModuleFields.map(
                                                        (field) => (
                                                          <option
                                                            key={field._id}
                                                            value={field._id}
                                                          >
                                                            {field.name}
                                                          </option>
                                                        )
                                                      )}
                                                    </select>
                                                    {selectedArrayField &&
                                                      selectedArrayField.typeSchema &&
                                                      selectedArrayField
                                                        .typeSchema.length >
                                                        0 && (
                                                        <select
                                                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                          value={
                                                            rule.sourceField?.replace(
                                                              "item.",
                                                              ""
                                                            ) || ""
                                                          }
                                                          onChange={(e) =>
                                                            updateExistingRelationshipRule(
                                                              index,
                                                              eventType,
                                                              ruleIndex,
                                                              "sourceField",
                                                              `item.${e.target.value}`
                                                            )
                                                          }
                                                        >
                                                          <option value="">
                                                            Select Array Field
                                                          </option>
                                                          {selectedArrayField.typeSchema.map(
                                                            (schemaField) => (
                                                              <option
                                                                key={
                                                                  schemaField.name
                                                                }
                                                                value={
                                                                  schemaField.name
                                                                }
                                                              >
                                                                {
                                                                  schemaField.name
                                                                }
                                                              </option>
                                                            )
                                                          )}
                                                        </select>
                                                      )}
                                                  </div>
                                                  {eventType !== "onCreate" && (
                                                    <div className="flex gap-1">
                                                      <select
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        value={rule.value || ""}
                                                        onChange={(e) =>
                                                          updateExistingRelationshipRule(
                                                            index,
                                                            eventType,
                                                            ruleIndex,
                                                            "value",
                                                            e.target.value
                                                          )
                                                        }
                                                      >
                                                        <option value="">
                                                          Select Value Field
                                                        </option>
                                                        {targetModuleFields.map(
                                                          (field) => (
                                                            <option
                                                              key={field._id}
                                                              value={field.name}
                                                            >
                                                              {field.name}
                                                            </option>
                                                          )
                                                        )}
                                                      </select>
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          removeExistingRelationshipRule(
                                                            index,
                                                            eventType,
                                                            ruleIndex
                                                          )
                                                        }
                                                        className="text-red-600 hover:text-red-700"
                                                      >
                                                        <X size={14} />
                                                      </button>
                                                    </div>
                                                  )}
                                                  {eventType === "onCreate" && (
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        removeExistingRelationshipRule(
                                                          index,
                                                          eventType,
                                                          ruleIndex
                                                        )
                                                      }
                                                      className="text-red-600 hover:text-red-700"
                                                    >
                                                      <X size={14} />
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {/* Add New Relationship */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-3">
                        Add New Relationship
                      </h5>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Module
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={currentEditRelationship.targetModule}
                          onChange={(e) =>
                            handleEditTargetModuleChange(e.target.value)
                          }
                        >
                          <option value="">Select a module</option>
                          {allModules
                            .filter(
                              (module) => module._id !== editingModule?._id
                            )
                            .map((module) => (
                              <option key={module._id} value={module._id}>
                                {module.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Event Rules */}
                      <div className="space-y-4">
                        <h6 className="font-medium text-gray-600 flex items-center gap-2">
                          <Settings size={14} />
                          Event Rules
                        </h6>

                        {(["onCreate", "onUpdate", "onDelete"] as const).map(
                          (eventType) => (
                            <div
                              key={eventType}
                              className="border border-gray-200 rounded p-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {eventType.replace("on", "On ")}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addEditEventRule(eventType)}
                                  className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  + Add Rule
                                </button>
                              </div>

                              {currentEditRelationship.eventRules?.[
                                eventType
                              ]?.map((rule, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 p-2 rounded mb-2"
                                >
                                  <div
                                    className={`grid gap-2 ${
                                      eventType === "onCreate"
                                        ? "grid-cols-1 md:grid-cols-3"
                                        : "grid-cols-1 md:grid-cols-3"
                                    }`}
                                  >
                                    <select
                                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                                      value={rule.action}
                                      onChange={(e) =>
                                        updateEditEventRule(
                                          eventType,
                                          index,
                                          "action",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select Action</option>
                                      {availableActions.map((action) => (
                                        <option key={action} value={action}>
                                          {action}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                                      value={
                                        rule.targetField
                                          ? rule.targetField.split("-")[1] || ""
                                          : ""
                                      }
                                      onChange={(e) =>
                                        handleEditTargetFieldChange(
                                          eventType,
                                          index,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Target Field</option>
                                      {targetModuleFields.map((field) => (
                                        <option
                                          key={field._id}
                                          value={field._id}
                                        >
                                          {field.name}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="space-y-1">
                                      <select
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        value={getSelectedSourceFieldId(
                                          eventType,
                                          index
                                        )}
                                        onChange={(e) => {
                                          setSelectedSourceFieldId(
                                            eventType,
                                            index,
                                            e.target.value
                                          );
                                          const selectedField =
                                            currentModuleFields.find(
                                              (f) => f._id === e.target.value
                                            );
                                          if (selectedField) {
                                            const fieldDataType =
                                              dataTypes.find(
                                                (dt) =>
                                                  dt._id ===
                                                  selectedField.type._id
                                              );
                                            if (
                                              fieldDataType?.name?.toLowerCase() ===
                                              "array"
                                            ) {
                                              setSelectedArrayField(
                                                selectedField
                                              );
                                              updateEditEventRule(
                                                eventType,
                                                index,
                                                "sourceField",
                                                ""
                                              );
                                            } else {
                                              setSelectedArrayField(null);
                                              updateEditEventRule(
                                                eventType,
                                                index,
                                                "sourceField",
                                                selectedField.name
                                              );
                                            }
                                          } else {
                                            setSelectedArrayField(null);
                                            updateEditEventRule(
                                              eventType,
                                              index,
                                              "sourceField",
                                              ""
                                            );
                                          }
                                        }}
                                      >
                                        <option value="">Source Field</option>
                                        {currentModuleFields.map((field) => (
                                          <option
                                            key={field._id}
                                            value={field._id}
                                          >
                                            {field.name}
                                          </option>
                                        ))}
                                      </select>
                                      {selectedArrayField &&
                                        selectedArrayField.typeSchema &&
                                        selectedArrayField.typeSchema.length >
                                          0 && (
                                          <select
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            value={
                                              rule.sourceField?.replace(
                                                "item.",
                                                ""
                                              ) || ""
                                            }
                                            onChange={(e) =>
                                              updateEditEventRule(
                                                eventType,
                                                index,
                                                "sourceField",
                                                `item.${e.target.value}`
                                              )
                                            }
                                          >
                                            <option value="">
                                              Select Array Field
                                            </option>
                                            {selectedArrayField.typeSchema.map(
                                              (schemaField) => (
                                                <option
                                                  key={schemaField.name}
                                                  value={schemaField.name}
                                                >
                                                  {schemaField.name}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeEditEventRule(eventType, index)
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={addEditRelationship}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        disabled={!currentEditRelationship.targetModule}
                      >
                        Add Relationship
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowEditRelationships(false);
                    setEditingModule(null);
                    setEditFormData({ name: "", relationships: [] });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;
