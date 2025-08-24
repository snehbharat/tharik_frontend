import React from "react";
import { Save, X, RefreshCw, Clock, FileText } from "lucide-react";

const UpdateModal = ({ 
  showUpdateModal, 
  setShowUpdateModal, 
  newUpdate, 
  setNewUpdate, 
  handleAddUpdate, 
  isArabic,
  loading = false
}) => {
  if (!showUpdateModal) return null;

  const handleSave = () => {
    if (newUpdate.text.trim()) {
      handleAddUpdate(showUpdateModal);
    }
  };

  const isUpdateValid = newUpdate.text.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {isArabic ? "إضافة تحديث" : "Add Update"}
          </h3>
          <button
            onClick={() => setShowUpdateModal(null)}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Current Time Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {isArabic ? "وقت التحديث:" : "Update Time:"}
              </span>
              <span>
                {new Date().toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: !isArabic
                })}
              </span>
            </div>
          </div>

          {/* Update Text - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "التحديث (إنجليزي)" : "Update (English)"} *
            </label>
            <textarea
              value={newUpdate.text}
              onChange={(e) =>
                setNewUpdate({ ...newUpdate, text: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !isUpdateValid && newUpdate.text.length > 0 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              }`}
              placeholder={isArabic ? "اكتب التحديث..." : "Enter update..."}
              required
              disabled={loading}
            />
            <div className="text-xs text-gray-500 mt-1">
              {newUpdate.text.length} {isArabic ? "حرف" : "characters"}
            </div>
          </div>

          {/* Update Text - Arabic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "التحديث (عربي)" : "Update (Arabic)"}
            </label>
            <textarea
              value={newUpdate.textAr}
              onChange={(e) =>
                setNewUpdate({ ...newUpdate, textAr: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={
                isArabic
                  ? "اكتب التحديث بالعربية..."
                  : "Enter update in Arabic..."
              }
              disabled={loading}
              dir="rtl"
            />
            <div className="text-xs text-gray-500 mt-1">
              {newUpdate.textAr.length} {isArabic ? "حرف" : "characters"}
            </div>
          </div>

          {/* Pre-defined Updates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isArabic ? "تحديثات جاهزة:" : "Quick Updates:"}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  en: "Task started - Initial preparations completed",
                  ar: "بدأت المهمة - تم الانتهاء من التحضيرات الأولية"
                },
                {
                  en: "Progress update - 50% completed",
                  ar: "تحديث التقدم - تم إنجاز 50%"
                },
                {
                  en: "Waiting for approval to proceed",
                  ar: "في انتظار الموافقة للمتابعة"
                },
                {
                  en: "Task completed successfully",
                  ar: "تم إنجاز المهمة بنجاح"
                },
                {
                  en: "Issue encountered - need assistance",
                  ar: "واجهت مشكلة - أحتاج مساعدة"
                },
                {
                  en: "Documentation uploaded",
                  ar: "تم رفع الوثائق"
                }
              ].map((update, index) => (
                <button
                  key={index}
                  onClick={() => setNewUpdate({
                    ...newUpdate,
                    text: update.en,
                    textAr: update.ar
                  })}
                  disabled={loading}
                  className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 rounded border transition-colors"
                >
                  <div className="font-medium">
                    {isArabic ? update.ar : update.en}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isArabic ? update.en : update.ar}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={loading || !isUpdateValid}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                loading || !isUpdateValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading 
                ? (isArabic ? "جارٍ الحفظ..." : "Saving...") 
                : (isArabic ? "إضافة التحديث" : "Add Update")
              }
            </button>
            <button
              onClick={() => setShowUpdateModal(null)}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg transition-colors"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded p-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                {isArabic ? (
                  <>
                    <strong>نصيحة:</strong> استخدم التحديثات الجاهزة لتوفير الوقت، أو اكتب تحديث مخصص.
                    إذا لم تقم بكتابة النص العربي، سيتم استخدام النص الإنجليزي.
                  </>
                ) : (
                  <>
                    <strong>Tip:</strong> Use quick updates to save time, or write a custom update.
                    If Arabic text is not provided, English text will be used.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;