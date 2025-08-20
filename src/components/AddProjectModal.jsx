import React, { useState, useEffect } from "react";
import { Save, X, AlertCircle } from "lucide-react";
import ProjectServiceClient from "../services/ProjectServiceClient";

export default function AddProjectModal({ 
  isArabic, 
  newProject, 
  setNewProject, 
  onSave, 
  onClose, 
  loading ,
  clients
}) {
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  


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

  // Validation function
  const validateField = (fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.toString().trim() === "")) {
      return rule.message;
    }

    // String validations
    if (typeof value === "string") {
      if (rule.minLength && value.trim().length < rule.minLength) {
        return rule.message;
      }
      if (rule.maxLength && value.trim().length > rule.maxLength) {
        return rule.message;
      }
    }

    // Number validations
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

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, newProject[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    // Date validations
    if (newProject.startDate && newProject.endDate) {
      const startDate = new Date(newProject.startDate);
      const endDate = new Date(newProject.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = isArabic ? "تاريخ البداية لا يمكن أن يكون في الماضي" : "Start date cannot be in the past";
      }

      if (endDate <= startDate) {
        newErrors.endDate = isArabic ? "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية" : "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change with validation
  const handleFieldChange = (fieldName, value) => {
    // Update the field value
    setNewProject({ ...newProject, [fieldName]: value });
    
    // Clear previous error for this field
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: null });
    }
    
    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }
  };


  // Format data for API
  const formatProjectData = (project) => {
    // Find selected client
    const selectedClient = clients.find(client => client.id === project.clientId);
    
    return {
      name: project.name?.trim(),
      description: project.description?.trim() || "",
      client_name: selectedClient ? (isArabic ? selectedClient.client_name_arb : selectedClient.client_name_eng) : "",
      location: project.location?.trim(),
      start_date: project.startDate,
      end_date: project.endDate,
      budget: parseFloat(project.budget) || 0,
      Client_id: project.clientId || "",
    };
  };


 
  
  // Handle form submission
  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setApiError("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for API
      const formattedData = formatProjectData(newProject);
      
      // Call API
      const result = await ProjectServiceClient.createProject(formattedData);
      
      // Call parent's onSave function with the result
      if (onSave) {
        await onSave(result);
        
      }
      
      // Close modal on success
      onClose();
      
    } catch (error) {
      setApiError(
        error.message || 
        (isArabic ? "حدث خطأ أثناء حفظ المشروع" : "An error occurred while saving the project")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const hasErrors = () => {
    return Object.keys(errors).some(key => errors[key]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {isArabic ? "إضافة مشروع جديد" : "Add New Project"}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{apiError}</span>
          </div>
        )}

        {/* Project form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "اسم المشروع" : "Project Name"} *
              </label>
              <input
                type="text"
                value={newProject.name || ""}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 ${
                  getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                disabled={isSubmitting}
              />
              {getFieldError('name') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "العميل" : "Client"} *
              </label>
              <select
                value={newProject.clientId || ""}
                onChange={(e) => handleFieldChange('clientId', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 ${
                  getFieldError('clientId') ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                disabled={isSubmitting}
              >
                <option value="">
                  {isArabic ? "-- اختر العميل --" : "-- Select Client --"}
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {isArabic 
                      ? (client.client_name_arb || client.client_name_eng || 'Unnamed Client')
                      : (client.client_name_eng || 'Unnamed Client')
                    }
                  </option>
                ))}
              </select>
              {getFieldError('clientId') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('clientId')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "الموقع" : "Location"} *
              </label>
              <input
                type="text"
                value={newProject.location || ""}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 ${
                  getFieldError('location') ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                disabled={isSubmitting}
              />
              {getFieldError('location') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('location')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "الميزانية (ريال)" : "Budget (SAR)"} *
              </label>
              <input
                type="number"
                value={newProject.budget || ""}
                onChange={(e) => handleFieldChange('budget', parseFloat(e.target.value) || "")}
                className={`w-full border rounded-lg px-3 py-2 ${
                  getFieldError('budget') ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                step="0.01"
                required
                disabled={isSubmitting}
              />
              {getFieldError('budget') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('budget')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "تاريخ البداية" : "Start Date"} *
              </label>
              <input
                type="date"
                value={newProject.startDate || ""}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 ${
                  getFieldError('startDate') ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                disabled={isSubmitting}
              />
              {getFieldError('startDate') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('startDate')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "تاريخ الانتهاء" : "End Date"} *
              </label>
              <input
                type="date"
                value={newProject.endDate || ""}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 ${
                  getFieldError('endDate') ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                disabled={isSubmitting}
              />
              {getFieldError('endDate') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('endDate')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "هامش الربح (%)" : "Profit Margin (%)"}
              </label>
              <input
                type="number"
                value={newProject.profitMargin || ""}
                onChange={(e) => handleFieldChange('profitMargin', parseFloat(e.target.value) || "")}
                className={`w-full border rounded-lg px-3 py-2 ${
                  getFieldError('profitMargin') ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                max="100"
                step="0.1"
                disabled={isSubmitting}
              />
              {getFieldError('profitMargin') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('profitMargin')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "مستوى المخاطر" : "Risk Level"}
              </label>
              <select
                value={newProject.riskLevel || "low"}
                onChange={(e) => handleFieldChange('riskLevel', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                disabled={isSubmitting}
              >
                <option value="low">{isArabic ? "منخفض" : "Low"}</option>
                <option value="medium">{isArabic ? "متوسط" : "Medium"}</option>
                <option value="high">{isArabic ? "عالي" : "High"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "وصف المشروع" : "Project Description"}
            </label>
            <textarea
              value={newProject.description || ""}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {newProject.description?.length || 0}/500 {isArabic ? "حرف" : "characters"}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isSubmitting || hasErrors()}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isSubmitting || hasErrors() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Save className="w-4 h-4" />
              {isSubmitting 
                ? (isArabic ? "جاري الحفظ..." : "Saving...") 
                : (isArabic ? "حفظ المشروع" : "Save Project")
              }
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