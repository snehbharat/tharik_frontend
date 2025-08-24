import {
  User,
  Building2,
  Wrench,
  CheckSquare,
  Shield,
  Truck,
  Users,
  FileText,
} from "lucide-react";

export const getStatusColor = (status) => {
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

export const getPriorityColor = (priority) => {
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

export const getTypeIcon = (type) => {
  switch (type) {
    case "Driver Assignment":
      return User;
    case "Manpower Deployment":
      return Building2;
    case "Vehicle Maintenance":
      return Wrench;
    case "Site Work":
      return CheckSquare;
    case "Safety Inspection":
      return Shield;
    case "Equipment Transport":
      return Truck;
    case "Client Meeting":
      return Users;
    case "Document Processing":
      return FileText;
    default:
      return CheckSquare;
  }
};


export const filterTasks = (tasks, activeTab) => {
  switch (activeTab) {
    case "active":
      return tasks.filter((task) =>
        ["Active", "In Progress", "Pending"].includes(task.status)
      );
    case "completed":
      return tasks.filter((task) => task.status === "Completed");
    case "overdue":
      return tasks.filter((task) => task.status === "Overdue");
    default:
      return tasks;
  }
};

// Task types and employees data
export const taskTypes = [
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

export const employees = [
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