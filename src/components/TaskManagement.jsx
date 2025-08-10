import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  MapPin,
  User,
  Truck,
  Wrench,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle,
  Camera,
  MessageSquare,
  Phone,
  Save,
  X,
  Users,
  Shield,
  FileText,
  Target,
  Navigation,
  Upload,
  Send,
  Image,
  Paperclip,
} from "lucide-react";

export const TaskManagement = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("active");
  const [showNewTask, setShowNewTask] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(null);
  const [showSMSModal, setShowSMSModal] = useState(null);

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

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Driver Assignment - Aramco Project",
      titleAr: "تعيين سائق - مشروع أرامكو",
      type: "Driver Assignment",
      typeAr: "تعيين سائق",
      priority: "High",
      status: "In Progress",
      assignedTo: "Ahmed Al-Rashid",
      assignedToAr: "أحمد الراشد",
      dueDate: "2024-12-16",
      createdDate: "2024-12-15",
      location: "Dhahran Industrial Complex",
      coordinates: "26.2885° N, 50.1500° E",
      description: "Assign qualified driver for heavy equipment transport",
      descriptionAr: "تعيين سائق مؤهل لنقل المعدات الثقيلة",
      requirements: {
        licenseType: "Heavy Vehicle License",
        experience: "5+ years",
        certifications: ["Safety Training", "Hazmat Certified"],
      },
      progress: 75,
      updates: [
        {
          time: "14:30",
          update: "Driver identified and contacted",
          updateAr: "تم تحديد السائق والتواصل معه",
          type: "text",
          photos: [],
        },
        {
          time: "15:45",
          update: "License verification completed",
          updateAr: "تم التحقق من الرخصة",
          type: "text",
          photos: [],
        },
        {
          time: "16:20",
          update: "Driver documentation photos uploaded",
          updateAr: "تم رفع صور وثائق السائق",
          type: "photo",
          photos: [
            {
              name: "driver_license.jpg",
              url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
            },
            {
              name: "safety_certificate.jpg",
              url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Manpower Deployment - SABIC Site",
      titleAr: "نشر القوى العاملة - موقع سابك",
      type: "Manpower Deployment",
      typeAr: "نشر القوى العاملة",
      priority: "Medium",
      status: "Pending",
      assignedTo: "Mohammad Hassan",
      assignedToAr: "محمد حسن",
      dueDate: "2024-12-18",
      createdDate: "2024-12-14",
      location: "Jubail Industrial City",
      coordinates: "27.0174° N, 49.6251° E",
      description: "Deploy 15 skilled workers for construction support",
      descriptionAr: "نشر 15 عامل ماهر لدعم البناء",
      requirements: {
        workerCount: 15,
        skills: ["Construction", "Welding", "Safety"],
        duration: "3 months",
      },
      progress: 30,
      updates: [
        {
          time: "09:00",
          update: "Worker selection in progress",
          updateAr: "جاري اختيار العمال",
          type: "text",
          photos: [],
        },
      ],
    },
    {
      id: 3,
      title: "Vehicle Maintenance - Fleet Group A",
      titleAr: "صيانة المركبات - المجموعة أ",
      type: "Vehicle Maintenance",
      typeAr: "صيانة المركبات",
      priority: "High",
      status: "Overdue",
      assignedTo: "Ali Al-Mahmoud",
      assignedToAr: "علي المحمود",
      dueDate: "2024-12-14",
      createdDate: "2024-12-10",
      location: "AMOAGC Maintenance Center",
      coordinates: "24.7136° N, 46.6753° E",
      description: "Scheduled maintenance for 8 vehicles",
      descriptionAr: "صيانة مجدولة لـ 8 مركبات",
      requirements: {
        vehicleCount: 8,
        maintenanceType: "Preventive",
        estimatedTime: "2 days",
      },
      progress: 60,
      updates: [
        {
          time: "08:00",
          update: "Started maintenance on first batch",
          updateAr: "بدء الصيانة للدفعة الأولى",
          type: "text",
          photos: [],
        },
        {
          time: "12:00",
          update: "4 vehicles completed",
          updateAr: "تم الانتهاء من 4 مركبات",
          type: "text",
          photos: [],
        },
      ],
    },
    {
      id: 4,
      title: "Site Work Supervision - NEOM",
      titleAr: "إشراف أعمال الموقع - نيوم",
      type: "Site Work",
      typeAr: "أعمال الموقع",
      priority: "High",
      status: "Active",
      assignedTo: "Fatima Al-Zahra",
      assignedToAr: "فاطمة الزهراء",
      dueDate: "2024-12-20",
      createdDate: "2024-12-12",
      location: "NEOM - Tabuk Province",
      coordinates: "28.2636° N, 34.7917° E",
      description: "Supervise infrastructure development work",
      descriptionAr: "الإشراف على أعمال تطوير البنية التحتية",
      requirements: {
        supervisors: 3,
        workers: 25,
        equipment: ["Excavators", "Trucks", "Safety Gear"],
      },
      progress: 45,
      updates: [
        {
          time: "07:00",
          update: "Daily safety briefing completed",
          updateAr: "تم الانتهاء من إحاطة السلامة اليومية",
          type: "text",
          photos: [],
        },
        {
          time: "10:30",
          update: "Progress photos uploaded",
          updateAr: "تم رفع صور التقدم",
          type: "photo",
          photos: [
            {
              name: "site_progress_1.jpg",
              url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
            },
            {
              name: "safety_check.jpg",
              url: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg",
            },
          ],
        },
      ],
    },
  ]);

  const taskTypes = [
    {
      value: "Driver Assignment",
      label: "Driver Assignment",
      labelAr: "تعيين سائق",
    },
    {
      value: "Manpower Deployment",
      label: "Manpower Deployment",
      labelAr: "نشر القوى العاملة",
    },
    {
      value: "Vehicle Maintenance",
      label: "Vehicle Maintenance",
      labelAr: "صيانة المركبات",
    },
    { value: "Site Work", label: "Site Work", labelAr: "أعمال الموقع" },
    {
      value: "Safety Inspection",
      label: "Safety Inspection",
      labelAr: "تفتيش السلامة",
    },
    {
      value: "Equipment Transport",
      label: "Equipment Transport",
      labelAr: "نقل المعدات",
    },
    {
      value: "Client Meeting",
      label: "Client Meeting",
      labelAr: "اجتماع عميل",
    },
    {
      value: "Document Processing",
      label: "Document Processing",
      labelAr: "معالجة المستندات",
    },
  ];

  const employees = [
    {
      value: "ahmed-rashid",
      label: "Ahmed Al-Rashid",
      labelAr: "أحمد الراشد",
      phone: "+966501234567",
    },
    {
      value: "mohammad-hassan",
      label: "Mohammad Hassan",
      labelAr: "محمد حسن",
      phone: "+966502345678",
    },
    {
      value: "ali-mahmoud",
      label: "Ali Al-Mahmoud",
      labelAr: "علي المحمود",
      phone: "+966503456789",
    },
    {
      value: "fatima-zahra",
      label: "Fatima Al-Zahra",
      labelAr: "فاطمة الزهراء",
      phone: "+966504567890",
    },
    {
      value: "omar-abdullah",
      label: "Omar Abdullah",
      labelAr: "عمر عبدالله",
      phone: "+966505678901",
    },
    {
      value: "sara-ahmed",
      label: "Sara Ahmed",
      labelAr: "سارة أحمد",
      phone: "+966506789012",
    },
  ];

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    const task = {
      ...newTask,
      id: Math.max(...tasks.map((t) => t.id)) + 1,
      status: "Pending",
      createdDate: new Date().toISOString().split("T")[0],
      progress: 0,
      updates: [
        {
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          update: "Task created",
          updateAr: "تم إنشاء المهمة",
          type: "text",
          photos: [],
        },
      ],
    };

    setTasks([...tasks, task]);
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
    setShowNewTask(false);
    alert(isArabic ? "تم إنشاء المهمة بنجاح!" : "Task created successfully!");
  };

  const handleAddUpdate = (taskId) => {
    if (!newUpdate.text.trim()) {
      alert(isArabic ? "يرجى كتابة التحديث" : "Please enter update text");
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const update = {
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          update: newUpdate.text,
          updateAr: newUpdate.textAr || newUpdate.text,
          type: "text",
          photos: [],
        };
        return {
          ...task,
          updates: [...task.updates, update],
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setNewUpdate({ text: "", textAr: "", photos: [] });
    setShowUpdateModal(null);
    alert(isArabic ? "تم إضافة التحديث بنجاح!" : "Update added successfully!");
  };

  const handlePhotoUpload = (taskId, files) => {
    if (!files || files.length === 0) return;

    const photoFiles = Array.from(files);
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const photoUpdate = {
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          update: `${photoFiles.length} photos uploaded`,
          updateAr: `تم رفع ${photoFiles.length} صورة`,
          type: "photo",
          photos: photoFiles.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
          })),
        };
        return {
          ...task,
          updates: [...task.updates, photoUpdate],
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setShowPhotoModal(null);
    alert(isArabic ? "تم رفع الصور بنجاح!" : "Photos uploaded successfully!");
  };

  const handleSendSMS = (taskId) => {
    if (!smsMessage.message.trim()) {
      alert(isArabic ? "يرجى كتابة الرسالة" : "Please enter SMS message");
      return;
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const assignedEmployee = employees.find(
      (emp) => emp.value === task.assignedTo
    );

    // Simulate SMS sending
    console.log("Sending SMS:", {
      to: assignedEmployee?.phone,
      message: smsMessage.message,
      messageAr: smsMessage.messageAr,
      task: task.title,
    });

    // Add SMS update to task
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const smsUpdate = {
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          update: `SMS reminder sent: "${smsMessage.message}"`,
          updateAr: `تم إرسال تذكير SMS: "${
            smsMessage.messageAr || smsMessage.message
          }"`,
          type: "sms",
          photos: [],
        };
        return {
          ...t,
          updates: [...t.updates, smsUpdate],
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    setSmsMessage({ message: "", messageAr: "", recipients: [] });
    setShowSMSModal(null);
    alert(
      isArabic ? "تم إرسال التذكير بنجاح!" : "SMS reminder sent successfully!"
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Driver Assignment":
        return <User className="w-5 h-5 text-blue-600" />;
      case "Manpower Deployment":
        return <Building2 className="w-5 h-5 text-green-600" />;
      case "Vehicle Maintenance":
        return <Wrench className="w-5 h-5 text-orange-600" />;
      case "Site Work":
        return <CheckSquare className="w-5 h-5 text-purple-600" />;
      case "Safety Inspection":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "Equipment Transport":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "Client Meeting":
        return <Users className="w-5 h-5 text-green-600" />;
      case "Document Processing":
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return <CheckSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case "photo":
        return <Camera className="w-3 h-3 text-blue-500" />;
      case "sms":
        return <Phone className="w-3 h-3 text-green-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    switch (activeTab) {
      case "active":
        return (
          task.status === "Active" ||
          task.status === "In Progress" ||
          task.status === "Pending"
        );
      case "completed":
        return task.status === "Completed";
      case "overdue":
        return task.status === "Overdue";
      default:
        return true;
    }
  });

  const renderRequirementsFields = () => {
    switch (newTask.type) {
      case "Driver Assignment":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الرخصة المطلوبة" : "Required License Type"}
                </label>
                <select
                  value={newTask.requirements.licenseType}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        licenseType: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select License Type</option>
                  <option value="Light Vehicle License">
                    Light Vehicle License
                  </option>
                  <option value="Heavy Vehicle License">
                    Heavy Vehicle License
                  </option>
                  <option value="Motorcycle License">Motorcycle License</option>
                  <option value="Bus License">Bus License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "سنوات الخبرة المطلوبة" : "Required Experience"}
                </label>
                <select
                  value={newTask.requirements.experience}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        experience: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Experience</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "Manpower Deployment":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عدد العمال" : "Worker Count"}
                </label>
                <input
                  type="number"
                  value={newTask.requirements.workerCount}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        workerCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المدة" : "Duration"}
                </label>
                <select
                  value={newTask.requirements.duration}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        duration: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Duration</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المهارات المطلوبة" : "Required Skills"}
                </label>
                <input
                  type="text"
                  placeholder={
                    isArabic
                      ? "مثال: لحام، بناء، كهرباء"
                      : "e.g., Welding, Construction, Electrical"
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        );

      case "Vehicle Maintenance":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عدد المركبات" : "Vehicle Count"}
                </label>
                <input
                  type="number"
                  value={newTask.requirements.vehicleCount}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        vehicleCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الصيانة" : "Maintenance Type"}
                </label>
                <select
                  value={newTask.requirements.maintenanceType}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        maintenanceType: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Corrective">Corrective</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوقت المقدر" : "Estimated Time"}
                </label>
                <select
                  value={newTask.requirements.estimatedTime}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        estimatedTime: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Time</option>
                  <option value="2 hours">2 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="1 day">1 day</option>
                  <option value="2 days">2 days</option>
                  <option value="1 week">1 week</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "Site Work":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عدد المشرفين" : "Supervisors"}
                </label>
                <input
                  type="number"
                  value={newTask.requirements.supervisors}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        supervisors: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عدد العمال" : "Workers"}
                </label>
                <input
                  type="number"
                  value={newTask.requirements.workerCount}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        workerCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المعدات المطلوبة" : "Required Equipment"}
                </label>
                <input
                  type="text"
                  placeholder={
                    isArabic
                      ? "مثال: حفارات، شاحنات، معدات السلامة"
                      : "e.g., Excavators, Trucks, Safety Gear"
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "إدارة المهام المتقدمة" : "Advanced Task Management"}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <MapPin className="w-4 h-4" />
            {isArabic ? "تتبع GPS" : "GPS Tracking"}
          </button>
          <button
            onClick={() => setShowNewTask(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "مهمة جديدة" : "New Task"}
          </button>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {
              tasks.filter((t) =>
                ["Active", "In Progress", "Pending"].includes(t.status)
              ).length
            }
          </div>
          <div className="text-sm text-blue-700">
            {isArabic ? "مهام نشطة" : "Active Tasks"}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter((t) => t.status === "Completed").length}
          </div>
          <div className="text-sm text-green-700">
            {isArabic ? "مكتملة هذا الشهر" : "Completed This Month"}
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            {tasks.filter((t) => t.status === "Overdue").length}
          </div>
          <div className="text-sm text-red-700">
            {isArabic ? "متأخرة" : "Overdue"}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {tasks.filter((t) => t.priority === "High").length}
          </div>
          <div className="text-sm text-yellow-700">
            {isArabic ? "أولوية عالية" : "High Priority"}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">89%</div>
          <div className="text-sm text-purple-700">
            {isArabic ? "معدل الإنجاز" : "Completion Rate"}
          </div>
        </div>
      </div>

      {/* Recent Updates Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">
              {isArabic ? "نظام التحديثات المتقدم" : "Advanced Updates System"}
            </h3>
            <p className="text-sm text-green-700">
              {isArabic
                ? "رفع الصور • إضافة التحديثات النصية • إرسال تذكيرات SMS • تتبع التقدم في الوقت الفعلي"
                : "Photo uploads • Text updates • SMS reminders • Real-time progress tracking"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "active"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                {isArabic ? "المهام النشطة" : "Active Tasks"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "completed"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {isArabic ? "المكتملة" : "Completed"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("overdue")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "overdue"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {isArabic ? "المتأخرة" : "Overdue"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    {getTypeIcon(task.type)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isArabic ? task.titleAr : task.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>
                            {isArabic ? task.assignedToAr : task.assignedTo}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {isArabic ? "مستحق:" : "Due:"} {task.dueDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{task.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Task Details */}
                  <div className="lg:col-span-2">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {isArabic ? "الوصف:" : "Description:"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isArabic ? task.descriptionAr : task.description}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {isArabic ? "المتطلبات:" : "Requirements:"}
                      </h4>
                      <div className="bg-white rounded-lg p-3 text-sm">
                        {Object.entries(task.requirements).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between py-1"
                            >
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, " $1")}:
                              </span>
                              <span className="text-gray-900">
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">
                          {isArabic ? "التقدم:" : "Progress:"}
                        </h4>
                        <span className="text-sm font-medium text-gray-600">
                          {task.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Updates & Actions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        {isArabic ? "آخر التحديثات:" : "Recent Updates:"}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {task.updates.length} {isArabic ? "تحديث" : "updates"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                      {task.updates.slice(-3).map((update, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-3 text-sm border border-gray-100"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getUpdateIcon(update.type)}
                            <span className="text-gray-500">{update.time}</span>
                            {update.type === "photo" && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                {Array.isArray(update.photos)
                                  ? update.photos.length
                                  : 0}{" "}
                                {isArabic ? "صورة" : "photos"}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">
                            {isArabic ? update.updateAr : update.update}
                          </p>
                          {Array.isArray(update.photos) &&
                            update.photos.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {update.photos
                                  .slice(0, 3)
                                  .map((photo, photoIndex) => (
                                    <div key={photoIndex} className="relative">
                                      <img
                                        src={photo.url}
                                        alt={photo.name}
                                        className="w-12 h-12 object-cover rounded border"
                                      />
                                      {update.photos.length > 3 &&
                                        photoIndex === 2 && (
                                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center text-white text-xs">
                                            +{update.photos.length - 3}
                                          </div>
                                        )}
                                    </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setShowPhotoModal(task.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        {isArabic ? "رفع صور" : "Upload Photos"}
                      </button>
                      <button
                        onClick={() => setShowUpdateModal(task.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {isArabic ? "إضافة تحديث" : "Add Update"}
                      </button>
                      <button
                        onClick={() => setShowSMSModal(task.id)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {isArabic ? "تذكير SMS" : "SMS Reminder"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* GPS Coordinates */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {isArabic ? "الإحداثيات:" : "GPS Coordinates:"}
                      </span>
                      <span className="font-mono">{task.coordinates}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {isArabic ? "عرض على الخريطة" : "View on Map"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {isArabic ? "رفع الصور" : "Upload Photos"}
              </h3>
              <button
                onClick={() => setShowPhotoModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                  onChange={(e) =>
                    handlePhotoUpload(showPhotoModal, e.target.files)
                  }
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isArabic ? "اختيار الصور" : "Select Photos"}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {isArabic ? "إضافة تحديث" : "Add Update"}
              </h3>
              <button
                onClick={() => setShowUpdateModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "التحديث (إنجليزي)" : "Update (English)"} *
                </label>
                <textarea
                  value={newUpdate.text}
                  onChange={(e) =>
                    setNewUpdate({ ...newUpdate, text: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder={isArabic ? "اكتب التحديث..." : "Enter update..."}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "التحديث (عربي)" : "Update (Arabic)"}
                </label>
                <textarea
                  value={newUpdate.textAr}
                  onChange={(e) =>
                    setNewUpdate({ ...newUpdate, textAr: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder={
                    isArabic
                      ? "اكتب التحديث بالعربية..."
                      : "Enter update in Arabic..."
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddUpdate(showUpdateModal)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "إضافة التحديث" : "Add Update"}
                </button>
                <button
                  onClick={() => setShowUpdateModal(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMS Reminder Modal */}
      {showSMSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {isArabic ? "إرسال تذكير SMS" : "Send SMS Reminder"}
              </h3>
              <button
                onClick={() => setShowSMSModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-800">
                  <strong>{isArabic ? "المرسل إليه:" : "Recipient:"}</strong>
                  {(() => {
                    const task = tasks.find((t) => t.id === showSMSModal);
                    const employee = employees.find(
                      (emp) => emp.value === task?.assignedTo
                    );
                    return (
                      <div className="mt-1">
                        {isArabic ? employee?.labelAr : employee?.label} (
                        {employee?.phone})
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الرسالة (إنجليزي)" : "Message (English)"} *
                </label>
                <textarea
                  value={smsMessage.message}
                  onChange={(e) =>
                    setSmsMessage({ ...smsMessage, message: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder={
                    isArabic
                      ? "اكتب رسالة التذكير..."
                      : "Enter reminder message..."
                  }
                  maxLength={160}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {smsMessage.message.length}/160{" "}
                  {isArabic ? "حرف" : "characters"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الرسالة (عربي)" : "Message (Arabic)"}
                </label>
                <textarea
                  value={smsMessage.messageAr}
                  onChange={(e) =>
                    setSmsMessage({ ...smsMessage, messageAr: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder={
                    isArabic
                      ? "اكتب رسالة التذكير بالعربية..."
                      : "Enter reminder message in Arabic..."
                  }
                  maxLength={160}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {smsMessage.messageAr.length}/160{" "}
                  {isArabic ? "حرف" : "characters"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSendSMS(showSMSModal)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isArabic ? "إرسال التذكير" : "Send Reminder"}
                </button>
                <button
                  onClick={() => setShowSMSModal(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTask && (
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
                      {isArabic
                        ? "عنوان المهمة (إنجليزي)"
                        : "Task Title (English)"}{" "}
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

                <div className="mt-4">
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
                </div>
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
      )}
    </div>
  );
};
