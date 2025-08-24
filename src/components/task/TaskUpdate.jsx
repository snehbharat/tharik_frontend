import React from "react";
import { Camera, Phone, Clock } from "lucide-react";

const TaskUpdate = ({ update, index, isArabic }) => (
  <div className="bg-white rounded-lg p-3 text-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-1">
      {update.type === "photo" && <Camera className="w-3 h-3 text-blue-500" />}
      {update.type === "sms" && <Phone className="w-3 h-3 text-green-500" />}
      {update.type === "text" && <Clock className="w-3 h-3 text-gray-500" />}
      <span className="text-gray-500">{update.time}</span>
      {update.type === "photo" && (
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
          {Array.isArray(update.photos) ? update.photos.length : 0}{" "}
          {isArabic ? "صورة" : "photos"}
        </span>
      )}
    </div>
    <p className="text-gray-700 mb-2">
      {isArabic ? update.updateAr : update.update}
    </p>
    {Array.isArray(update.photos) && update.photos.length > 0 && (
      <div className="flex gap-2 mt-2">
        {update.photos.slice(0, 3).map((photo, photoIndex) => (
          <div key={photoIndex} className="relative">
            <img
              src={photo.url}
              alt={photo.name}
              className="w-12 h-12 object-cover rounded border"
            />
            {update.photos.length > 3 && photoIndex === 2 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center text-white text-xs">
                +{update.photos.length - 3}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default TaskUpdate;