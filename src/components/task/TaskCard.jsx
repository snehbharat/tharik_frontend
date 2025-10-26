import React, { useState } from "react";
import {
  Camera,
  MessageSquare,
  Phone,
  MapPin,
  Calendar,
  User,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TaskUpdate from "./TaskUpdate";
import TaskRequirements from "./TaskRequirements";
import {
  formatDate,
  formatTime,
  getRelativeTime,
} from "../../utils/dataTransformers";
import ProgressSlider from "./ProgressSlider";

const TaskCard = ({
  task,
  isArabic,
  getTypeIcon,
  getPriorityColor,
  getStatusColor,
  setShowPhotoModal,
  setShowUpdateModal,
  setShowSMSModal,
  onTaskUpdate,
  loading = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  console.log("task", task);

  const taskId = task.id || task._id;

  const handleStatusUpdate = async (newStatus) => {
    if (onTaskUpdate) {
      setLocalLoading(true);
      try {
        await onTaskUpdate(taskId, { status: newStatus });
      } catch (error) {
        console.error("Error updating task status:", error);
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleProgressUpdate = async (newProgress) => {
    if (onTaskUpdate) {
      setLocalLoading(true);
      try {
        await onTaskUpdate(taskId, { progress: newProgress });
      } catch (error) {
        console.error("Error updating task progress:", error);
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const TypeIcon = getTypeIcon(task.type);
  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority);

  // Determine which updates to show
  const updatesToShow =
    task.updates && task.updates.length > 0
      ? showAllUpdates
        ? task.updates.slice().reverse() // Show all updates, newest first
        : task.updates.slice(-3).reverse() // Show last 3 updates, newest first
      : [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-blue-50 p-3 rounded-lg">
              <TypeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? task.titleAr || task.title : task.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}
                >
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{isArabic ? task.assignedToAr : task.assignedTo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(task.dueDate, isArabic)}</span>
                </div>
                {task.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-32">{task.location}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                >
                  {task.status}
                </span>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 rounded-full h-2 w-24">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {task.progress || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              disabled={loading || localLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                <div className="py-1">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    {isArabic ? "عرض التفاصيل" : "View Details"}
                  </button>
                  <button
                    onClick={() => setShowUpdateModal(taskId)}
                    disabled={loading || localLoading}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {isArabic ? "إضافة تحديث" : "Add Update"}
                  </button>
                  <button
                    onClick={() => setShowPhotoModal(taskId)}
                    disabled={loading || localLoading}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    {isArabic ? "رفع صور" : "Upload Photos"}
                  </button>
                  <button
                    onClick={() => setShowSMSModal(taskId)}
                    disabled={loading || localLoading}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Phone className="w-4 h-4" />
                    {isArabic ? "إرسال SMS" : "Send SMS"}
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => handleStatusUpdate("Completed")}
                    disabled={
                      loading || localLoading || task.status === "Completed"
                    }
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isArabic ? "تأكيد الإنجاز" : "Mark Complete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUpdateModal(taskId)}
            disabled={loading || localLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {isArabic ? "تحديث" : "Update"}
          </button>
          <button
            onClick={() => setShowPhotoModal(taskId)}
            disabled={loading || localLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            <Camera className="w-4 h-4" />
            {isArabic ? "صور" : "Photos"}
          </button>
          <button
            onClick={() => setShowSMSModal(taskId)}
            disabled={loading || localLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            {isArabic ? "SMS" : "SMS"}
          </button>

          {/* Progress Update Slider */}
          <ProgressSlider
            value={task.progress || 0}
            onChange={handleProgressUpdate}
            disabled={loading || localLoading || task.status === "Completed"}
            isArabic={isArabic}
          />
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="p-6 space-y-6">
          {/* Description */}
          {task.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {isArabic ? "الوصف:" : "Description:"}
              </h4>
              <p className="text-gray-700 text-sm">
                {isArabic
                  ? task.descriptionAr || task.description
                  : task.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {task.requirements && Object.keys(task.requirements).length > 0 && (
            <TaskRequirements
              requirements={task.requirements}
              isArabic={isArabic}
            />
          )}

          {/* Task Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                {isArabic ? "تاريخ الإنشاء" : "Created Date"}
              </div>
              <div className="text-sm font-medium">
                {formatDate(task.createdDate || task.createdAt, isArabic)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                {isArabic ? "تاريخ الاستحقاق" : "Due Date"}
              </div>
              <div className="text-sm font-medium">
                {formatDate(task.dueDate || task.due_date, isArabic)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                {isArabic ? "النوع" : "Type"}
              </div>
              <div className="text-sm font-medium">
                {isArabic ? task.typeAr || task.type : task.type}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                {isArabic ? "آخر تحديث" : "Last Updated"}
              </div>
              <div className="text-sm font-medium">
                {getRelativeTime(task.updatedAt || task.updated_at, isArabic)}
              </div>
            </div>
          </div>

          {/* GPS Coordinates */}
          {task.coordinates && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">
                  {isArabic ? "الإحداثيات الجغرافية:" : "GPS Coordinates:"}
                </span>
              </div>
              <div className="text-blue-700 text-sm font-mono">
                {task.coordinates}
              </div>
              <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline">
                {isArabic ? "عرض على الخريطة" : "View on Map"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recent Updates */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">
            {isArabic ? "التحديثات:" : "Updates:"}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {task.updates?.length || 0} {isArabic ? "تحديث" : "updates"}
            </span>
            {task.updates && task.updates.length > 3 && (
              <button
                onClick={() => setShowAllUpdates(!showAllUpdates)}
                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 transition-colors"
              >
                {showAllUpdates ? (
                  <>
                    {isArabic ? "عرض أقل" : "Show less"}
                    <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    {isArabic ? "عرض الكل" : "Show all"}
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div
          className={`space-y-3 ${
            showAllUpdates
              ? "max-h-96 overflow-y-auto"
              : "max-h-60 overflow-y-auto"
          }`}
        >
          {updatesToShow.length > 0 ? (
            updatesToShow.map((update, index) => (
              <TaskUpdate
                key={update.id || index}
                update={update}
                index={index}
                isArabic={isArabic}
              />
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">
                {isArabic ? "لا توجد تحديثات حتى الآن" : "No updates yet"}
              </p>
            </div>
          )}
        </div>

        {/* Show indication when viewing limited updates */}
        {!showAllUpdates && task.updates && task.updates.length > 3 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowAllUpdates(true)}
              className="w-full text-blue-600 hover:text-blue-800 text-sm py-2 border-t border-gray-100 flex items-center justify-center gap-2 transition-colors"
            >
              {isArabic
                ? `عرض جميع التحديثات (${task.updates.length})`
                : `View all ${task.updates.length} updates`}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
