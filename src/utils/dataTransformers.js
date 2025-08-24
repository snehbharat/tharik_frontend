/**
 * Transform backend task data to frontend format
 */
export const transformTaskFromBackend = (backendTask) => {
  if (!backendTask) return null;
  
  return {
    id: backendTask._id || backendTask.id,
    title: backendTask.title,
    titleAr: backendTask.titleAr,
    type: backendTask.type,
    typeAr: backendTask.typeAr,
    priority: backendTask.priority,
    status: backendTask.status,
    assignedTo: backendTask.assigned_to?._id || backendTask.assigned_to,
    assignedToAr: backendTask.assignedToAr || backendTask.assigned_to?.nameAr || backendTask.assigned_to?.name,
    dueDate: backendTask.due_date ? new Date(backendTask.due_date).toISOString().split('T')[0] : backendTask.dueDate,
    createdDate: backendTask.created_at ? new Date(backendTask.created_at).toISOString().split('T')[0] : backendTask.createdDate,
    location: backendTask.location,
    coordinates: backendTask.coordinates,
    description: backendTask.description,
    descriptionAr: backendTask.descriptionAr,
    requirements: backendTask.requirements || {},
    progress: backendTask.progress || backendTask.completion_percentage || 0,
    updates: backendTask.updates || [],
    // Additional backend fields
    assignedBy: backendTask.assigned_by,
    projectId: backendTask.project_id,
    createdAt: backendTask.created_at,
    updatedAt: backendTask.updated_at,
  };
};

/**
 * Transform frontend task data to backend format
 */
export const transformTaskToBackend = (frontendTask) => {
  if (!frontendTask) return null;
  
  const backendTask = {
    title: frontendTask.title,
    titleAr: frontendTask.titleAr,
    type: frontendTask.type,
    priority: frontendTask.priority,
    assigned_to: frontendTask.assignedTo,
    due_date: frontendTask.dueDate,
    location: frontendTask.location,
    coordinates: frontendTask.coordinates,
    description: frontendTask.description,
    descriptionAr: frontendTask.descriptionAr,
    requirements: frontendTask.requirements,
  };

  // Only include fields that have values
  Object.keys(backendTask).forEach(key => {
    if (backendTask[key] === undefined || backendTask[key] === null || backendTask[key] === '') {
      delete backendTask[key];
    }
  });

  return backendTask;
};

/**
 * Transform array of tasks from backend
 */
export const transformTasksFromBackend = (backendTasks) => {
  if (!Array.isArray(backendTasks)) return [];
  
  return backendTasks.map(transformTaskFromBackend);
};

/**
 * Transform filter parameters for backend API
 */
export const transformFiltersToBackend = (frontendFilters) => {
  const backendFilters = { ...frontendFilters };
  
  // Map frontend filter names to backend names if needed
  if (backendFilters.assignedTo) {
    backendFilters.assigned_to = backendFilters.assignedTo;
    delete backendFilters.assignedTo;
  }
  
  if (backendFilters.dueDate) {
    backendFilters.due_date = backendFilters.dueDate;
    delete backendFilters.dueDate;
  }

  return backendFilters;
};

/**
 * Transform employee data from backend
 */
export const transformEmployeesFromBackend = (backendEmployees) => {
  if (!Array.isArray(backendEmployees)) return [];
  
  return backendEmployees.map(emp => ({
    value: emp._id || emp.id,
    label: emp.name || `${emp.first_name} ${emp.last_name}`,
    labelAr: emp.nameAr || emp.name,
    phone: emp.phone || emp.mobile_number,
    ...emp
  }));
};

/**
 * Format date for display
 */
export const formatDate = (dateString, isArabic = false) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isArabic) {
    return date.toLocaleDateString('ar-SA');
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format time for display
 */
export const formatTime = (timeString, isArabic = false) => {
  if (!timeString) return '';
  
  const time = new Date(`1970-01-01T${timeString}`);
  
  return time.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !isArabic
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString, isArabic = false) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return isArabic ? 'الآن' : 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return isArabic ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return isArabic ? `منذ ${diffInHours} ساعة` : `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return isArabic ? `منذ ${diffInDays} يوم` : `${diffInDays} days ago`;
};

/**
 * Validate task data before submission
 */
export const validateTaskData = (taskData, isArabic = false) => {
  const errors = [];
  
  if (!taskData.title?.trim()) {
    errors.push(isArabic ? 'العنوان مطلوب' : 'Title is required');
  }
  
  if (!taskData.assignedTo) {
    errors.push(isArabic ? 'المسؤول عن المهمة مطلوب' : 'Assigned employee is required');
  }
  
  if (!taskData.dueDate) {
    errors.push(isArabic ? 'تاريخ الاستحقاق مطلوب' : 'Due date is required');
  }
  
  if (!taskData.type) {
    errors.push(isArabic ? 'نوع المهمة مطلوب' : 'Task type is required');
  }
  
  // Validate due date is not in the past
  if (taskData.dueDate && new Date(taskData.dueDate) < new Date().setHours(0,0,0,0)) {
    errors.push(isArabic ? 'تاريخ الاستحقاق لا يمكن أن يكون في الماضي' : 'Due date cannot be in the past');
  }
  
  return errors;
};

/**
 * Handle API errors and provide user-friendly messages
 */
export const handleApiError = (error, isArabic = false) => {
  console.error('API Error:', error);
  
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return isArabic ? 
      'فشل في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.' : 
      'Failed to connect to server. Please check your internet connection.';
  }
  
  // HTTP errors
  if (error.message.includes('HTTP error')) {
    const status = error.message.match(/\d+/)?.[0];
    switch (status) {
      case '400':
        return isArabic ? 'بيانات غير صحيحة' : 'Invalid data provided';
      case '401':
        return isArabic ? 'غير مخول للوصول' : 'Unauthorized access';
      case '403':
        return isArabic ? 'ممنوع الوصول' : 'Access forbidden';
      case '404':
        return isArabic ? 'المورد غير موجود' : 'Resource not found';
      case '500':
        return isArabic ? 'خطأ في الخادم' : 'Server error';
      default:
        return isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
    }
  }
  
  // Return the original error message if available
  return error.message || (isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
};