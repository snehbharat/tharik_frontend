import React, { useState } from "react";
import {
  Zap,
  Send,
  TestTube,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  Bell,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Settings,
  Target,
  Activity,
} from "lucide-react";
import { useNotificationSender } from "../../hooks/useNotifications";

export const NotificationTester = ({ isArabic }) => {
  const [activeTest, setActiveTest] = useState("document"); // 'document' | 'project' | 'payroll' | 'custom'
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const {
    sendDocumentExpiryAlert,
    sendProjectStatusChange,
    sendPayrollComplete,
    sendCustomNotification,
  } = useNotificationSender();

  // Test data for different notification types
  const [documentTestData, setDocumentTestData] = useState({
    employeeId: "emp_001",
    employeeName: "Ahmed Al-Rashid",
    documentType: "Iqama",
    expiryDate: "2024-12-30",
    daysRemaining: 15,
  });

  const [projectTestData, setProjectTestData] = useState({
    projectId: "proj_001",
    projectName: "Aramco Facility Maintenance",
    oldStatus: "active",
    newStatus: "hold",
    changedBy: "Project Manager",
    reason: "Weather delays and material shortage",
    nextActions: "Resume when conditions improve",
  });

  const [payrollTestData, setPayrollTestData] = useState({
    payrollPeriod: "December 2024",
    employeeCount: 186,
    totalAmount: 2450000,
    processedBy: "HR Manager",
    paymentDate: "2024-12-25",
  });

  const [customTestData, setCustomTestData] = useState({
    type: "safety_incident",
    title: "Safety Incident Report",
    description: "Minor safety incident reported at Site A",
    severity: "medium",
    location: "Dhahran Industrial Complex",
    reportedBy: "Safety Officer",
  });

  const runTest = async (testType) => {
    setIsRunning(true);
    const startTime = Date.now();

    try {
      let result;

      switch (testType) {
        case "document":
          result = await sendDocumentExpiryAlert(documentTestData);
          break;
        case "project":
          result = await sendProjectStatusChange(projectTestData);
          break;
        case "payroll":
          result = await sendPayrollComplete(payrollTestData);
          break;
        case "custom":
          result = await sendCustomNotification(
            customTestData.type,
            customTestData,
            "medium"
          );
          break;
        default:
          throw new Error("Unknown test type");
      }

      const endTime = Date.now();
      const testResult = {
        id: Date.now(),
        type: testType,
        status: "success",
        duration: endTime - startTime,
        timestamp: new Date(),
        data: result || { success: true },
      };

      setTestResults((prev) => [testResult, ...prev.slice(0, 19)]);
    } catch (error) {
      const endTime = Date.now();
      const testResult = {
        id: Date.now(),
        type: testType,
        status: "error",
        duration: endTime - startTime,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      };

      setTestResults((prev) => [testResult, ...prev.slice(0, 19)]);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const tests = ["document", "project", "payroll", "custom"];

    for (const test of tests) {
      await runTest(test);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // delay between tests
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const exportResults = () => {
    const csvContent = [
      ["Timestamp", "Test Type", "Status", "Duration (ms)", "Error"],
      ...testResults.map((result) => [
        result.timestamp.toISOString(),
        result.type,
        result.status,
        result.duration.toString(),
        result.error || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notification_test_results_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTestIcon = (testType) => {
    switch (testType) {
      case "document":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "project":
        return <Target className="w-5 h-5 text-blue-600" />;
      case "payroll":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "custom":
        return <Zap className="w-5 h-5 text-purple-600" />;
      default:
        return <TestTube className="w-5 h-5 text-gray-600" />;
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? "اختبار نظام التنبيهات" : "Notification System Tester"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isArabic
              ? "اختبار شامل لنظام التنبيهات متعدد القنوات"
              : "Comprehensive testing for multi-channel notification system"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportResults}
            disabled={testResults.length === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير النتائج" : "Export Results"}
          </button>
          <button
            onClick={clearResults}
            disabled={testResults.length === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {isArabic ? "مسح النتائج" : "Clear Results"}
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning
              ? isArabic
                ? "جاري التشغيل..."
                : "Running..."
              : isArabic
              ? "تشغيل جميع الاختبارات"
              : "Run All Tests"}
          </button>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTest("document")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTest === "document"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {isArabic ? "انتهاء الوثائق" : "Document Expiry"}
              </div>
            </button>
            <button
              onClick={() => setActiveTest("project")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTest === "project"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? "تغيير حالة المشروع" : "Project Status"}
              </div>
            </button>
            <button
              onClick={() => setActiveTest("payroll")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTest === "payroll"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {isArabic ? "معالجة الرواتب" : "Payroll Processing"}
              </div>
            </button>
            <button
              onClick={() => setActiveTest("custom")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTest === "custom"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {isArabic ? "تنبيه مخصص" : "Custom Notification"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTest === "document" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                {isArabic
                  ? "اختبار تنبيه انتهاء الوثائق"
                  : "Document Expiry Alert Test"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الموظف" : "Employee Name"}
                  </label>
                  <input
                    type="text"
                    value={documentTestData.employeeName}
                    onChange={(e) =>
                      setDocumentTestData({
                        ...documentTestData,
                        employeeName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "نوع الوثيقة" : "Document Type"}
                  </label>
                  <select
                    value={documentTestData.documentType}
                    onChange={(e) =>
                      setDocumentTestData({
                        ...documentTestData,
                        documentType: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Iqama">Iqama</option>
                    <option value="Passport">Passport</option>
                    <option value="Visa">Visa</option>
                    <option value="Contract">Contract</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ الانتهاء" : "Expiry Date"}
                  </label>
                  <input
                    type="date"
                    value={documentTestData.expiryDate}
                    onChange={(e) =>
                      setDocumentTestData({
                        ...documentTestData,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الأيام المتبقية" : "Days Remaining"}
                  </label>
                  <input
                    type="number"
                    value={documentTestData.daysRemaining}
                    onChange={(e) =>
                      setDocumentTestData({
                        ...documentTestData,
                        daysRemaining: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    max="365"
                  />
                </div>
              </div>

              <button
                onClick={() => runTest("document")}
                disabled={isRunning}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                {isArabic
                  ? "إرسال تنبيه انتهاء الوثيقة"
                  : "Send Document Expiry Alert"}
              </button>
            </div>
          )}

          {activeTest === "project" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                {isArabic
                  ? "اختبار تنبيه تغيير حالة المشروع"
                  : "Project Status Change Test"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم المشروع" : "Project Name"}
                  </label>
                  <input
                    type="text"
                    value={projectTestData.projectName}
                    onChange={(e) =>
                      setProjectTestData({
                        ...projectTestData,
                        projectName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الحالة الجديدة" : "New Status"}
                  </label>
                  <select
                    value={projectTestData.newStatus}
                    onChange={(e) =>
                      setProjectTestData({
                        ...projectTestData,
                        newStatus: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="hold">Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تم التغيير بواسطة" : "Changed By"}
                  </label>
                  <input
                    type="text"
                    value={projectTestData.changedBy}
                    onChange={(e) =>
                      setProjectTestData({
                        ...projectTestData,
                        changedBy: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "السبب" : "Reason"}
                  </label>
                  <input
                    type="text"
                    value={projectTestData.reason}
                    onChange={(e) =>
                      setProjectTestData({
                        ...projectTestData,
                        reason: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <button
                onClick={() => runTest("project")}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                {isArabic
                  ? "إرسال تنبيه تغيير المشروع"
                  : "Send Project Status Alert"}
              </button>
            </div>
          )}

          {activeTest === "payroll" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                {isArabic
                  ? "اختبار تنبيه معالجة الرواتب"
                  : "Payroll Processing Test"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "فترة الرواتب" : "Payroll Period"}
                  </label>
                  <input
                    type="text"
                    value={payrollTestData.payrollPeriod}
                    onChange={(e) =>
                      setPayrollTestData({
                        ...payrollTestData,
                        payrollPeriod: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "عدد الموظفين" : "Employee Count"}
                  </label>
                  <input
                    type="number"
                    value={payrollTestData.employeeCount}
                    onChange={(e) =>
                      setPayrollTestData({
                        ...payrollTestData,
                        employeeCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "إجمالي المبلغ (ريال)" : "Total Amount (SAR)"}
                  </label>
                  <input
                    type="number"
                    value={payrollTestData.totalAmount}
                    onChange={(e) =>
                      setPayrollTestData({
                        ...payrollTestData,
                        totalAmount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "تاريخ الدفع" : "Payment Date"}
                  </label>
                  <input
                    type="date"
                    value={payrollTestData.paymentDate}
                    onChange={(e) =>
                      setPayrollTestData({
                        ...payrollTestData,
                        paymentDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <button
                onClick={() => runTest("payroll")}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                {isArabic
                  ? "إرسال تنبيه معالجة الرواتب"
                  : "Send Payroll Processing Alert"}
              </button>
            </div>
          )}

          {activeTest === "custom" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                {isArabic
                  ? "اختبار التنبيه المخصص"
                  : "Custom Notification Test"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "نوع التنبيه" : "Notification Type"}
                  </label>
                  <select
                    value={customTestData.type}
                    onChange={(e) =>
                      setCustomTestData({
                        ...customTestData,
                        type: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="safety_incident">Safety Incident</option>
                    <option value="equipment_maintenance">
                      Equipment Maintenance
                    </option>
                    <option value="training_reminder">Training Reminder</option>
                    <option value="compliance_alert">Compliance Alert</option>
                    <option value="system_maintenance">
                      System Maintenance
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "العنوان" : "Title"}
                  </label>
                  <input
                    type="text"
                    value={customTestData.title}
                    onChange={(e) =>
                      setCustomTestData({
                        ...customTestData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الوصف" : "Description"}
                  </label>
                  <textarea
                    value={customTestData.description}
                    onChange={(e) =>
                      setCustomTestData({
                        ...customTestData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <button
                onClick={() => runTest("custom")}
                disabled={isRunning}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                {isArabic ? "إرسال التنبيه المخصص" : "Send Custom Notification"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {isArabic ? "نتائج الاختبار" : "Test Results"}
            </h3>
            <div className="text-sm text-gray-500">
              {testResults.length} {isArabic ? "نتيجة" : "results"}
            </div>
          </div>
        </div>

        <div className="p-6">
          {testResults.length === 0 ? (
            <div className="text-center py-8">
              <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {isArabic ? "لا توجد نتائج اختبار بعد" : "No test results yet"}
              </p>
              <p className="text-sm text-gray-400">
                {isArabic
                  ? "قم بتشغيل اختبار لرؤية النتائج"
                  : "Run a test to see results"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-4 rounded-lg border ${
                    result.status === "success"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      {getTestIcon(result.type)}
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {result.type.replace("_", " ")} Test
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {result.duration}ms
                      </div>
                      <div
                        className={`text-sm ${
                          result.status === "success"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.status}
                      </div>
                    </div>
                  </div>
                  {result.error && (
                    <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">
                      {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
