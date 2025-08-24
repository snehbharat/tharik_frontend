import React from "react";
import { Send, X, RefreshCw, User, Phone } from "lucide-react";

const SMSModal = ({ 
  showSMSModal, 
  setShowSMSModal, 
  smsMessage, 
  setSmsMessage, 
  handleSendSMS, 
  tasks, 
  employees, 
  isArabic,
  loading = false
}) => {
  if (!showSMSModal) return null;

  const task = tasks.find((t) => t.id === showSMSModal || t._id === showSMSModal);
  const employee = employees.find((emp) => 
    emp.value === task?.assignedTo || 
    emp.value === task?.assigned_to
  );

  const handleSend = () => {
    if (smsMessage.message.trim()) {
      handleSendSMS(showSMSModal);
    }
  };

  const isMessageValid = smsMessage.message.trim().length > 0;
  const characterCount = smsMessage.message.length;
  const characterCountAr = smsMessage.messageAr.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            {isArabic ? "إرسال تذكير SMS" : "Send SMS Reminder"}
          </h3>
          <button
            onClick={() => setShowSMSModal(null)}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Task Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">
              {isArabic ? "معلومات المهمة:" : "Task Information:"}
            </h4>
            <div className="text-sm text-blue-800 space-y-2">
              <div>
                <strong>{isArabic ? "العنوان:" : "Title:"}</strong>
                <div className="mt-1">
                  {isArabic ? task?.titleAr || task?.title : task?.title}
                </div>
              </div>
              <div>
                <strong>{isArabic ? "النوع:" : "Type:"}</strong>
                <span className="ml-2">
                  {isArabic ? task?.typeAr || task?.type : task?.type}
                </span>
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              {isArabic ? "المرسل إليه:" : "Recipient:"}
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex items-center gap-2">
                <strong>{isArabic ? "الاسم:" : "Name:"}</strong>
                <span>{isArabic ? employee?.labelAr : employee?.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <strong>{isArabic ? "الهاتف:" : "Phone:"}</strong>
                <span>{employee?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Message Input - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "الرسالة (إنجليزي)" : "Message (English)"} *
            </label>
            <textarea
              value={smsMessage.message}
              onChange={(e) =>
                setSmsMessage({ ...smsMessage, message: e.target.value })
              }
              className={`w-full border rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                !isMessageValid && smsMessage.message.length > 0 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              }`}
              placeholder={
                isArabic
                  ? "اكتب رسالة التذكير..."
                  : "Enter reminder message..."
              }
              maxLength={160}
              required
              disabled={loading}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={characterCount > 160 ? 'text-red-500' : 'text-gray-500'}>
                {characterCount}/160 {isArabic ? "حرف" : "characters"}
              </span>
              {characterCount > 160 && (
                <span className="text-red-500">
                  {isArabic ? "تجاوز الحد المسموح" : "Exceeds limit"}
                </span>
              )}
            </div>
          </div>

          {/* Message Input - Arabic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? "الرسالة (عربي)" : "Message (Arabic)"}
            </label>
            <textarea
              value={smsMessage.messageAr}
              onChange={(e) =>
                setSmsMessage({ ...smsMessage, messageAr: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={
                isArabic
                  ? "اكتب رسالة التذكير بالعربية..."
                  : "Enter reminder message in Arabic..."
              }
              maxLength={160}
              disabled={loading}
              dir="rtl"
            />
            <div className="text-xs text-gray-500 mt-1">
              {characterCountAr}/160 {isArabic ? "حرف" : "characters"}
            </div>
          </div>

          {/* Pre-defined Messages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isArabic ? "رسائل جاهزة:" : "Quick Messages:"}
            </label>
            <div className="space-y-2">
              {[
                {
                  en: "Please update the task status",
                  ar: "يرجى تحديث حالة المهمة"
                },
                {
                  en: "Task deadline is approaching",
                  ar: "موعد انتهاء المهمة يقترب"
                },
                {
                  en: "Please provide progress update",
                  ar: "يرجى تقديم تحديث عن التقدم"
                }
              ].map((msg, index) => (
                <button
                  key={index}
                  onClick={() => setSmsMessage({
                    ...smsMessage,
                    message: msg.en,
                    messageAr: msg.ar
                  })}
                  disabled={loading}
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 rounded border transition-colors"
                >
                  <div>{isArabic ? msg.ar : msg.en}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isArabic ? msg.en : msg.ar}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSend}
              disabled={loading || !isMessageValid || characterCount > 160}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                loading || !isMessageValid || characterCount > 160
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading 
                ? (isArabic ? "جارٍ الإرسال..." : "Sending...") 
                : (isArabic ? "إرسال التذكير" : "Send Reminder")
              }
            </button>
            <button
              onClick={() => setShowSMSModal(null)}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>

          {/* SMS Info */}
          <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1 flex-shrink-0"></div>
              <div>
                {isArabic ? (
                  <>
                    <strong>ملاحظة:</strong> سيتم إرسال الرسالة الإنجليزية إذا لم تكن الرسالة العربية متوفرة.
                    تأكد من صحة رقم الهاتف قبل الإرسال.
                  </>
                ) : (
                  <>
                    <strong>Note:</strong> English message will be sent if Arabic message is not provided.
                    Please verify the phone number before sending.
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

export default SMSModal;