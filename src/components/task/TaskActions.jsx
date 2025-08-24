import React from "react";
import { Camera, MessageSquare, Phone } from "lucide-react";

const TaskActions = ({ 
  taskId, 
  setShowPhotoModal, 
  setShowUpdateModal, 
  setShowSMSModal, 
  isArabic 
}) => (
  <div className="space-y-2">
    <button
      onClick={() => setShowPhotoModal(taskId)}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
    >
      <Camera className="w-4 h-4" />
      {isArabic ? "رفع صور" : "Upload Photos"}
    </button>
    <button
      onClick={() => setShowUpdateModal(taskId)}
      className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
    >
      <MessageSquare className="w-4 h-4" />
      {isArabic ? "إضافة تحديث" : "Add Update"}
    </button>
    <button
      onClick={() => setShowSMSModal(taskId)}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
    >
      <Phone className="w-4 h-4" />
      {isArabic ? "تذكير SMS" : "SMS Reminder"}
    </button>
  </div>
);

export default TaskActions;