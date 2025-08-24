import React, { useState, useEffect } from "react";
import { Save, X, AlertCircle, Edit } from "lucide-react";
import ProjectServiceClient from "../services/ProjectServiceClient";

export default function UpdateProjectModal({
    isOpen,
    isArabic,
    editingProject,
    setEditingProject,
    onSave,
    onClose,
    loading,
    clients,
    projectId
}) {
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when projectId changes or modal opens/closes
    useEffect(() => {
      
        
        if (isOpen && projectId) {
            setErrors({});
            setApiError("");
            setIsSubmitting(false);
        }
    }, [projectId, isOpen]);

    useEffect(() => {
       
        
        if (editingProject && editingProject.Client_id) {
            setEditingProject({
                ...editingProject,
                clientId: editingProject.Client_id._id
            });
        }
    }, [editingProject, setEditingProject]);

    // Validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 3,
            maxLength: 100,
            message: isArabic ? "اسم المشروع مطلوب (3-100 حرف)" : "Project name is required (3-100 characters)"
        },
        clientId: {
            required: true,
            message: isArabic ? "العميل مطلوب" : "Client is required"
        },
        location: {
            required: true,
            minLength: 2,
            maxLength: 200,
            message: isArabic ? "الموقع مطلوب (2-200 حرف)" : "Location is required (2-200 characters)"
        },
        budget: {
            required: true,
            min: 1,
            max: 999999999,
            message: isArabic ? "الميزانية مطلوبة ويجب أن تكون أكبر من 0" : "Budget is required and must be greater than 0"
        },
        startDate: {
            required: true,
            message: isArabic ? "تاريخ البداية مطلوب" : "Start date is required"
        },
        endDate: {
            required: true,
            message: isArabic ? "تاريخ الانتهاء مطلوب" : "End date is required"
        },
        profitMargin: {
            min: 0,
            max: 100,
            message: isArabic ? "هامش الربح يجب أن يكون بين 0 و 100%" : "Profit margin must be between 0 and 100%"
        }
    };

    if (!isOpen) return null;
    

    // Validation function
    const validateField = (fieldName, value) => {
        const rule = validationRules[fieldName];
        if (!rule) return null;

        if (rule.required && (!value || value.toString().trim() === "")) {
            return rule.message;
        }

        if (typeof value === "string") {
            if (rule.minLength && value.trim().length < rule.minLength) {
                return rule.message;
            }
            if (rule.maxLength && value.trim().length > rule.maxLength) {
                return rule.message;
            }
        }

        if (typeof value === "number" || !isNaN(parseFloat(value))) {
            const numValue = parseFloat(value);
            if (rule.min !== undefined && numValue < rule.min) {
                return rule.message;
            }
            if (rule.max !== undefined && numValue > rule.max) {
                return rule.message;
            }
        }

        return null;
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(validationRules).forEach(fieldName => {
            const error = validateField(fieldName, editingProject[fieldName]);
            if (error) newErrors[fieldName] = error;
        });

        if (editingProject.startDate && editingProject.endDate) {
            const startDate = new Date(editingProject.startDate);
            const endDate = new Date(editingProject.endDate);
            if (endDate <= startDate) {
                newErrors.endDate = isArabic ? "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية" : "End date must be after start date";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldChange = (fieldName, value) => {
        setEditingProject({ ...editingProject, [fieldName]: value });
        if (errors[fieldName]) setErrors({ ...errors, [fieldName]: null });
        if (apiError) setApiError("");
    };

    const formatProjectData = (project) => {
        const selectedClient = clients.find(
          (c) => (c._id || c.id) === project.clientId
        );
      
        return {
          name: project.name?.trim(),
          description: project.description?.trim() || "",
          clientId: project.clientId, 
          client_name: selectedClient
            ? (isArabic ? selectedClient.client_name_arb || selectedClient.client_name_eng
                        : selectedClient.client_name_eng)
            : "", 
          location: project.location?.trim(),
          startDate: project.startDate,
          endDate: project.endDate,
          budget: parseFloat(project.budget) || 0,
          profitMargin: project.profitMargin ? parseFloat(project.profitMargin) : 0,
          riskLevel: project.riskLevel || "low",
        };
      };
      
    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setApiError("");
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formattedData = formatProjectData(editingProject);
            const result = await ProjectServiceClient.updateProject(projectId, formattedData);
            alert(isArabic ? "تم تحديث المشروع بنجاح" : "Project updated successfully");
            if (onSave) await onSave(result);
            onClose();
        } catch (error) {
            setApiError(error.message || (isArabic ? "حدث خطأ أثناء تحديث المشروع" : "An error occurred while updating the project"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldError = (fieldName) => errors[fieldName];
    const hasErrors = () => Object.keys(errors).some(key => errors[key]);

    if (!editingProject) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto mt-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="flex  gap-3 items-center text-xl font-bold text-gray-900">
                        {isArabic ? "تحديث المشروع" : "Update Project"}
                       <Edit className="h-6 w-6"/>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* API Error */}
                {apiError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-red-700">{apiError}</span>
                    </div>
                )}

                {/* Form fields - exactly like AddProjectModal */}
                <div className="space-y-6">
                    {/* name + client */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "اسم المشروع" : "Project Name"} *</label>
                            <input
                                type="text"
                                value={editingProject.name || ""}
                                onChange={(e) => handleFieldChange("name", e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 ${getFieldError("name") ? "border-red-500" : "border-gray-300"}`}
                            />
                            {getFieldError("name") && <p className="text-red-500 text-sm mt-1">{getFieldError("name")}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "العميل" : "Client"} *</label>
                            <select
                                value={editingProject.clientId || ""}
                                onChange={(e) => handleFieldChange("clientId", e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 ${getFieldError("clientId") ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">{isArabic ? "-- اختر العميل --" : "-- Select Client --"}</option>
                                {clients.map((client) => (
                                    <option key={client._id || client.id} value={client._id || client.id}>
                                        {isArabic ? (client.client_name_arb || client.client_name_eng) : client.client_name_eng}
                                    </option>
                                ))}
                            </select>

                            {getFieldError("clientId") && <p className="text-red-500 text-sm mt-1">{getFieldError("clientId")}</p>}
                        </div>
                    </div>

                    {/* location + budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "الموقع" : "Location"} *</label>
                            <input
                                type="text"
                                value={editingProject.location || ""}
                                onChange={(e) => handleFieldChange("location", e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 ${getFieldError("location") ? "border-red-500" : "border-gray-300"}`}
                            />
                            {getFieldError("location") && <p className="text-red-500 text-sm mt-1">{getFieldError("location")}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "الميزانية (ريال)" : "Budget (SAR)"} *</label>
                            <input
                                type="number"
                                value={editingProject.budget || ""}
                                onChange={(e) => handleFieldChange("budget", parseFloat(e.target.value) || "")}
                                className={`w-full border rounded-lg px-3 py-2 ${getFieldError("budget") ? "border-red-500" : "border-gray-300"}`}
                            />
                            {getFieldError("budget") && <p className="text-red-500 text-sm mt-1">{getFieldError("budget")}</p>}
                        </div>
                    </div>

                    {/* dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "تاريخ البداية" : "Start Date"} *</label>
                            <input
                                type="date"
                                value={editingProject.startDate || ""}
                                onChange={(e) => handleFieldChange("startDate", e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 ${getFieldError("startDate") ? "border-red-500" : "border-gray-300"}`}
                            />
                            {getFieldError("startDate") && <p className="text-red-500 text-sm mt-1">{getFieldError("startDate")}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "تاريخ الانتهاء" : "End Date"} *</label>
                            <input
                                type="date"
                                value={editingProject.endDate || ""}
                                onChange={(e) => handleFieldChange("endDate", e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 ${getFieldError("endDate") ? "border-red-500" : "border-gray-300"}`}
                            />
                            {getFieldError("endDate") && <p className="text-red-500 text-sm mt-1">{getFieldError("endDate")}</p>}
                        </div>
                    </div>

                    {/* profit margin + risk */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "هامش الربح (%)" : "Profit Margin (%)"}</label>
                            <input
                                type="number"
                                value={editingProject.profitMargin || ""}
                                onChange={(e) => handleFieldChange("profitMargin", parseFloat(e.target.value) || "")}
                                className={`w-full border rounded-lg px-3 py-2 ${getFieldError("profitMargin") ? "border-red-500" : "border-gray-300"}`}
                            />
                            {getFieldError("profitMargin") && <p className="text-red-500 text-sm mt-1">{getFieldError("profitMargin")}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "مستوى المخاطر" : "Risk Level"}</label>
                            <select
                                value={editingProject.riskLevel || "low"}
                                onChange={(e) => handleFieldChange("riskLevel", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300"
                            >
                                <option value="low">{isArabic ? "منخفض" : "Low"}</option>
                                <option value="medium">{isArabic ? "متوسط" : "Medium"}</option>
                                <option value="high">{isArabic ? "عالي" : "High"}</option>
                            </select>
                        </div>
                    </div>

                    {/* description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{isArabic ? "وصف المشروع" : "Project Description"}</label>
                        <textarea
                            value={editingProject.description || ""}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            rows={3}
                            maxLength={500}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            {editingProject.description?.length || 0}/500 {isArabic ? "حرف" : "characters"}
                        </p>
                    </div>

                    {/* action buttons */}
                    <div className="flex items-center gap-1.5 pt-4">
                        <button
                            onClick={handleUpdate}
                            disabled={isSubmitting || hasErrors()}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${isSubmitting || hasErrors() ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting ? (isArabic ? "جاري التحديث..." : "Updating...") : (isArabic ? "تحديث المشروع" : "Update Project")}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isArabic ? "إلغاء" : "Cancel"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}