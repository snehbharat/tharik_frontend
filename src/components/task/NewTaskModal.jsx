import React from "react";
import { Save, X, Navigation } from "lucide-react";

const NewTaskModal = ({
  showNewTask,
  setShowNewTask,
  newTask,
  setNewTask,
  handleCreateTask,
  taskTypes,
  employees,
  renderRequirementsFields,
  isArabic,
}) => {
  if (!showNewTask) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {isArabic ? "إنشاء مهمة جديدة" : "Create New Task"}
          </h3>
          <button
            onClick={() => setShowNewTask(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">
              {isArabic ? "المعلومات الأساسية" : "Basic Information"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عنوان المهمة (إنجليزي)" : "Task Title (English)"}{" "}
                  *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عنوان المهمة (عربي)" : "Task Title (Arabic)"}
                </label>
                <input
                  type="text"
                  value={newTask.titleAr}
                  onChange={(e) =>
                    setNewTask({ ...newTask, titleAr: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع المهمة" : "Task Type"} *
                </label>
                <select
                  value={newTask.type}
                  onChange={(e) =>
                    setNewTask({ ...newTask, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {taskTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {isArabic ? type.labelAr : type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الأولوية" : "Priority"}
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "تاريخ الاستحقاق" : "Due Date"} *
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المسؤول عن المهمة" : "Assigned To"} *
                </label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.value} value={emp.value}>
                      {isArabic ? emp.labelAr : emp.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الموقع" : "Location"}
                </label>
                <input
                  type="text"
                  value={newTask.location}
                  onChange={(e) =>
                    setNewTask({ ...newTask, location: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={
                    isArabic
                      ? "مثال: الدمام، المجمع الصناعي"
                      : "e.g., Dammam Industrial Complex"
                  }
                />
              </div>
            </div>

            {/* <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "الإحداثيات الجغرافية" : "GPS Coordinates"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTask.coordinates}
                  onChange={(e) =>
                    setNewTask({ ...newTask, coordinates: e.target.value })
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={
                    isArabic
                      ? "مثال: 26.2885° N, 50.1500° E"
                      : "e.g., 26.2885° N, 50.1500° E"
                  }
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Navigation className="w-4 h-4" />
                  {isArabic ? "تحديد الموقع" : "Get Location"}
                </button>
              </div>
            </div> */}
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">
              {isArabic ? "الوصف" : "Description"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف (إنجليزي)" : "Description (English)"}
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder={
                    isArabic
                      ? "اكتب وصف المهمة..."
                      : "Enter task description..."
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف (عربي)" : "Description (Arabic)"}
                </label>
                <textarea
                  value={newTask.descriptionAr}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      descriptionAr: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder={
                    isArabic
                      ? "اكتب وصف المهمة بالعربية..."
                      : "Enter task description in Arabic..."
                  }
                />
              </div>
            </div>
          </div>

          {/* Task-Specific Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">
              {isArabic ? "متطلبات المهمة" : "Task Requirements"}
            </h4>
            {renderRequirementsFields()}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleCreateTask}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isArabic ? "إنشاء المهمة" : "Create Task"}
            </button>
            <button
              onClick={() => setShowNewTask(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
