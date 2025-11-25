import React, { useState, useEffect } from "react";
import { Plus, MapPin, RefreshCw } from "lucide-react";
import ApiService from "../../services/TaskApiService.js";

// Import all components
import TaskStatistics from "../task/TaskStatistics.jsx";
import UpdatesBanner from "../task/UpdatesBanner.jsx";
import TabNavigation from "../task/TabNavigation.jsx";
import TaskCard from "../task/TaskCard.jsx";
import PhotoModal from "../task/PhotoModal.jsx";
import UpdateModal from "../task/UpdateModal.jsx";
import SMSModal from "../task/SMSModal.jsx";
import NewTaskModal from "../task/NewTaskModal.jsx";
import TaskRequirementsFields from "../task/TaskRequirementsFields.jsx";

// Import utilities
import {
  getStatusColor,
  getPriorityColor,
  getTypeIcon,
  filterTasks,
  taskTypes,
} from "../task/taskUtils.jsx";

export const TaskManagementDashboard = ({ isArabic, currentUser }) => {
  const [activeTab, setActiveTab] = useState("active");
  const [showNewTask, setShowNewTask] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(null);
  const [showSMSModal, setShowSMSModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [newUpdate, setNewUpdate] = useState({
    text: "",
    textAr: "",
    photos: [],
  });

  const [smsMessage, setSmsMessage] = useState({
    message: "",
    messageAr: "",
    recipients: [],
  });

  const [newTask, setNewTask] = useState({
    title: "",
    titleAr: "",
    type: "Driver Assignment",
    priority: "Medium",
    assignedTo: "",
    dueDate: "",
    location: "",
    coordinates: "",
    description: "",
    descriptionAr: "",
    requirements: {
      licenseType: "",
      experience: "",
      certifications: [],
      workerCount: 0,
      skills: [],
      duration: "",
      vehicleCount: 0,
      maintenanceType: "",
      estimatedTime: "",
      supervisors: 0,
      equipment: [],
    },
  });

  // Load tasks on component mount and tab change
  useEffect(() => {
    loadTasks();
  }, [activeTab]);

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        tab: activeTab,
        ...(currentUser?.role === "employee" && {
          assigned_to: currentUser.id,
        }),
      };

      const response = await ApiService.getTasks(filters, {
        page: 1,
        limit: 50,
      });

      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getTasksAllEmployee();
      setEmployees(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    try {
      setLoading(true);

      const taskData = {
        ...newTask,
        assignedTo: newTask.assignedTo, // Map to backend field
        dueDate: newTask.dueDate,
      };

      const response = await ApiService.createTask(taskData, currentUser?.id);

      if (response.response) {
        // Reset form first
        setNewTask({
          title: "",
          titleAr: "",
          type: "Driver Assignment",
          priority: "Medium",
          assignedTo: "",
          dueDate: "",
          location: "",
          coordinates: "",
          description: "",
          descriptionAr: "",
          requirements: {
            licenseType: "",
            experience: "",
            certifications: [],
            workerCount: 0,
            skills: [],
            duration: "",
            vehicleCount: 0,
            maintenanceType: "",
            estimatedTime: "",
            supervisors: 0,
            equipment: [],
          },
        });

        // Close modal
        setShowNewTask(false);

        // Show success message
        alert(
          isArabic ? "تم إنشاء المهمة بنجاح!" : "Task created successfully!"
        );

        // Refresh the task list by calling loadTasks
        await loadTasks();
      }
    } catch (err) {
      setError(err.message);
      alert(isArabic ? `خطأ: ${err.message}` : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async (taskId) => {
    if (!newUpdate.text.trim()) {
      alert(isArabic ? "يرجى كتابة التحديث" : "Please enter update text");
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        text: newUpdate.text,
        textAr: newUpdate.textAr || newUpdate.text,
        type: "text",
      };

      const response = await ApiService.addTaskUpdate(taskId, updateData);

      if (response.response) {
        // Reset form first
        setNewUpdate({ text: "", textAr: "", photos: [] });

        // Close modal
        setShowUpdateModal(false);

        // Show success message
        alert(
          isArabic ? "تم إضافة التحديث بنجاح!" : "Update added successfully!"
        );

        // Refresh the task list by calling loadTasks
        await loadTasks();
      }
    } catch (err) {
      setError(err.message);
      alert(isArabic ? `خطأ: ${err.message}` : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (taskId, files) => {
    if (!files || files.length === 0) return;

    try {
      setLoading(true);

      // First upload files to get URLs
      const photoFiles = Array.from(files);
      const uploadedPhotos = [];

      // If you have a file upload service, use it. Otherwise, create object URLs for demo
      for (const file of photoFiles) {
        try {
          // Uncomment this if you have a file upload endpoint
          // const uploadResponse = await ApiService.uploadFile(file);
          // uploadedPhotos.push({
          //   name: file.name,
          //   url: uploadResponse.data.url
          // });

          // For demo purposes, using object URLs
          uploadedPhotos.push({
            name: file.name,
            url: URL.createObjectURL(file),
          });
        } catch (uploadErr) {
          console.error("Error uploading photo:", uploadErr);
        }
      }

      if (uploadedPhotos.length > 0) {
        const response = await ApiService.addPhotoUpdate(
          taskId,
          uploadedPhotos
        );

        if (response.success) {
          // Close modal
          setShowPhotoModal(null);

          // Show success message
          alert(
            isArabic ? "تم رفع الصور بنجاح!" : "Photos uploaded successfully!"
          );

          // Refresh the task list by calling loadTasks
          await loadTasks();
        }
      }
    } catch (err) {
      setError(err.message);
      alert(isArabic ? `خطأ: ${err.message}` : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMS = async (taskId) => {
    if (!smsMessage.message.trim()) {
      alert(isArabic ? "يرجى كتابة الرسالة" : "Please enter SMS message");
      return;
    }

    try {
      setLoading(true);

      const task = tasks.find((t) => t.id === taskId || t._id === taskId);
      if (!task) return;

      // Add SMS update to task
      const smsUpdateData = {
        text: `SMS reminder sent: "${smsMessage.message}"`,
        textAr: `تم إرسال تذكير SMS: "${
          smsMessage.messageAr || smsMessage.message
        }"`,
        type: "sms",
      };

      const response = await ApiService.addTaskUpdate(taskId, smsUpdateData);

      if (response.response) {
        // Reset form first
        setSmsMessage({ message: "", messageAr: "", recipients: [] });

        // Close modal
        setShowSMSModal(null);

        // Show success message
        alert(
          isArabic
            ? "تم إرسال التذكير بنجاح!"
            : "SMS reminder sent successfully!"
        );

        // Refresh the task list by calling loadTasks
        await loadTasks();
      }
    } catch (err) {
      setError(err.message);
      alert(isArabic ? `خطأ: ${err.message}` : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTasks();
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      setLoading(true);

      const response = await ApiService.updateTask(taskId, updates);

      if (response.response) {
        // Show success message
        alert(
          isArabic ? "تم تحديث المهمة بنجاح!" : "Task updated successfully!"
        );

        // Refresh the task list by calling loadTasks
        await loadTasks();
      }
    } catch (err) {
      setError(err.message);
      alert(isArabic ? `خطأ: ${err.message}` : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filterTasks(tasks, activeTab);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800">
            <strong>{isArabic ? "خطأ:" : "Error:"}</strong>
            <span>{error}</span>
            <button
              onClick={handleRefresh}
              className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              {isArabic ? "إعادة المحاولة" : "Retry"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semi-bold text-gray-900">
          {isArabic ? "نظرة عامة على المهام" : "Tasks Overview"}
        </h1>
        {/* <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {isArabic ? "تحديث" : "Refresh"}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <MapPin className="w-4 h-4" />
            {isArabic ? "تتبع GPS" : "GPS Tracking"}
          </button>
          <button
            onClick={() => setShowNewTask(true)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "مهمة جديدة" : "New Task"}
          </button>
        </div> */}
      </div>

      {/* Task Statistics */}
      <TaskStatistics tasks={tasks} isArabic={isArabic} />

      {/* Recent Updates Banner */}
      {/* <UpdatesBanner isArabic={isArabic} /> */}

      {/* Tabs */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isArabic={isArabic}
        />

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                {isArabic ? "جارٍ التحميل..." : "Loading..."}
              </span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">
                {isArabic
                  ? "لا توجد مهام في هذا القسم"
                  : "No tasks found in this section"}
              </p>
              <button
                onClick={() => setShowNewTask(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {isArabic ? "إنشاء مهمة جديدة" : "Create New Task"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id || task._id}
                  task={task}
                  isArabic={isArabic}
                  getTypeIcon={getTypeIcon}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  setShowPhotoModal={setShowPhotoModal}
                  setShowUpdateModal={setShowUpdateModal}
                  setShowSMSModal={setShowSMSModal}
                  onTaskUpdate={handleTaskUpdate}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>
      </div> */}

      {/* Modals */}
      <PhotoModal
        showPhotoModal={showPhotoModal}
        setShowPhotoModal={setShowPhotoModal}
        handlePhotoUpload={handlePhotoUpload}
        isArabic={isArabic}
        loading={loading}
      />

      <UpdateModal
        showUpdateModal={showUpdateModal}
        setShowUpdateModal={setShowUpdateModal}
        newUpdate={newUpdate}
        setNewUpdate={setNewUpdate}
        handleAddUpdate={handleAddUpdate}
        isArabic={isArabic}
        loading={loading}
      />

      <SMSModal
        showSMSModal={showSMSModal}
        setShowSMSModal={setShowSMSModal}
        smsMessage={smsMessage}
        setSmsMessage={setSmsMessage}
        handleSendSMS={handleSendSMS}
        tasks={tasks}
        employees={employees}
        isArabic={isArabic}
        loading={loading}
      />

      <NewTaskModal
        showNewTask={showNewTask}
        setShowNewTask={setShowNewTask}
        newTask={newTask}
        setNewTask={setNewTask}
        handleCreateTask={handleCreateTask}
        taskTypes={taskTypes}
        employees={employees}
        renderRequirementsFields={() => (
          <TaskRequirementsFields
            newTask={newTask}
            setNewTask={setNewTask}
            isArabic={isArabic}
          />
        )}
        isArabic={isArabic}
        loading={loading}
      />
    </div>
  );
};
