import React, { useState } from "react";
import { Camera, Upload, X, RefreshCw } from "lucide-react";

const PhotoModal = ({ 
  showPhotoModal, 
  setShowPhotoModal, 
  handlePhotoUpload, 
  isArabic,
  loading = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  if (!showPhotoModal) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      handlePhotoUpload(showPhotoModal, selectedFiles);
      setSelectedFiles([]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {isArabic ? "رفع الصور" : "Upload Photos"}
          </h3>
          <button
            onClick={() => {
              setShowPhotoModal(null);
              setSelectedFiles([]);
            }}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Drag and Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {isArabic
                ? "اختر الصور أو اسحبها هنا"
                : "Choose photos or drag them here"}
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
              disabled={loading}
            />
            <label
              htmlFor="photo-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <Upload className="w-4 h-4" />
              {isArabic ? "اختيار الصور" : "Select Photos"}
            </label>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">
                {isArabic ? "الصور المختارة:" : "Selected Photos:"}
              </h4>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      disabled={loading}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleUpload}
              disabled={loading || selectedFiles.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                loading || selectedFiles.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {loading 
                ? (isArabic ? "جارٍ الرفع..." : "Uploading...") 
                : (isArabic ? "رفع الصور" : "Upload Photos")
              }
            </button>
            <button
              onClick={() => {
                setShowPhotoModal(null);
                setSelectedFiles([]);
              }}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>

          {/* File Size Info */}
          <div className="text-xs text-gray-500 text-center">
            {isArabic 
              ? "الحد الأقصى لحجم الصورة: 5 ميجابايت لكل صورة" 
              : "Maximum file size: 5MB per image"
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;