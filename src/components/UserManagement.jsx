import React, { useState } from "react";
import {
  UserCog,
  Plus,
  Edit,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Key,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const UserManagement = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateUser, setShowCreateUser] = useState(false);

  const users = [
    {
      id: 1,
      username: "admin",
      nameEn: "System Administrator",
      nameAr: "مدير النظام",
      email: "admin@amoagc.sa",
      phone: "+966501234567",
      role: "Super Admin",
      department: "IT",
      status: "Active",
      lastLogin: "2024-12-15 09:30",
      createdDate: "2024-01-15",
      permissions: ["All"],
    },
    {
      id: 2,
      username: "hr.manager",
      nameEn: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      email: "hr@amoagc.sa",
      phone: "+966502345678",
      role: "HR Manager",
      department: "Human Resources",
      status: "Active",
      lastLogin: "2024-12-15 08:45",
      createdDate: "2024-02-01",
      permissions: ["HR Management", "Payroll", "Employee Records"],
    },
    {
      id: 3,
      username: "ops.supervisor",
      nameEn: "Ahmed Al-Rashid",
      nameAr: "أحمد الراشد",
      email: "operations@amoagc.sa",
      phone: "+966503456789",
      role: "Operations Supervisor",
      department: "Operations",
      status: "Active",
      lastLogin: "2024-12-14 16:20",
      createdDate: "2024-03-15",
      permissions: [
        "Project Management",
        "Manpower Assignment",
        "Fleet Management",
      ],
    },
    {
      id: 4,
      username: "finance.clerk",
      nameEn: "Mohammad Hassan",
      nameAr: "محمد حسن",
      email: "finance@amoagc.sa",
      phone: "+966504567890",
      role: "Finance Clerk",
      department: "Finance",
      status: "Inactive",
      lastLogin: "2024-12-10 14:15",
      createdDate: "2024-04-01",
      permissions: ["Invoice Management", "Financial Reports"],
    },
  ];

  const roles = [
    {
      name: "Super Admin",
      nameAr: "مدير عام",
      description: "Full system access with all permissions",
      descriptionAr: "وصول كامل للنظام مع جميع الصلاحيات",
      userCount: 1,
      permissions: ["All Modules", "User Management", "System Configuration"],
    },
    {
      name: "HR Manager",
      nameAr: "مدير الموارد البشرية",
      description: "Human resources and payroll management",
      descriptionAr: "إدارة الموارد البشرية والرواتب",
      userCount: 2,
      permissions: [
        "Employee Management",
        "Payroll",
        "Attendance",
        "Leave Management",
      ],
    },
    {
      name: "Operations Supervisor",
      nameAr: "مشرف العمليات",
      description: "Project and workforce management",
      descriptionAr: "إدارة المشاريع والقوى العاملة",
      userCount: 3,
      permissions: [
        "Project Management",
        "Manpower Assignment",
        "Fleet Tracking",
      ],
    },
    {
      name: "Finance Clerk",
      nameAr: "موظف مالية",
      description: "Financial operations and reporting",
      descriptionAr: "العمليات المالية والتقارير",
      userCount: 2,
      permissions: [
        "Invoice Management",
        "Financial Reports",
        "Client Billing",
      ],
    },
  ];

  const permissions = [
    {
      module: "Dashboard",
      moduleAr: "لوحة التحكم",
      permissions: [
        { name: "View Dashboard", nameAr: "عرض لوحة التحكم", granted: true },
        { name: "Export Reports", nameAr: "تصدير التقارير", granted: true },
      ],
    },
    {
      module: "Employee Management",
      moduleAr: "إدارة الموظفين",
      permissions: [
        { name: "View Employees", nameAr: "عرض الموظفين", granted: true },
        { name: "Add Employee", nameAr: "إضافة موظف", granted: true },
        { name: "Edit Employee", nameAr: "تعديل موظف", granted: true },
        { name: "Delete Employee", nameAr: "حذف موظف", granted: false },
      ],
    },
    {
      module: "Payroll Management",
      moduleAr: "إدارة الرواتب",
      permissions: [
        { name: "View Payroll", nameAr: "عرض الرواتب", granted: true },
        { name: "Process Payroll", nameAr: "معالجة الرواتب", granted: true },
        { name: "Approve Payroll", nameAr: "اعتماد الرواتب", granted: false },
      ],
    },
    {
      module: "Fleet Management",
      moduleAr: "إدارة الأسطول",
      permissions: [
        { name: "View Vehicles", nameAr: "عرض المركبات", granted: true },
        {
          name: "Schedule Maintenance",
          nameAr: "جدولة الصيانة",
          granted: true,
        },
        { name: "Vehicle Assignment", nameAr: "تخصيص المركبات", granted: true },
      ],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "إدارة المستخدمين" : "User Management"}
        </h1>
        <button
          onClick={() => setShowCreateUser(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {isArabic ? "إضافة مستخدم" : "Add User"}
        </button>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">8</div>
          <div className="text-sm text-blue-700">
            {isArabic ? "إجمالي المستخدمين" : "Total Users"}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">6</div>
          <div className="text-sm text-green-700">
            {isArabic ? "المستخدمون النشطون" : "Active Users"}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">4</div>
          <div className="text-sm text-yellow-700">
            {isArabic ? "الأدوار" : "Roles"}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">3</div>
          <div className="text-sm text-purple-700">
            {isArabic ? "تسجيلات دخول اليوم" : "Today's Logins"}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "users"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                {isArabic ? "المستخدمون" : "Users"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "roles"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {isArabic ? "الأدوار" : "Roles"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "permissions"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                {isArabic ? "الصلاحيات" : "Permissions"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table
                  className="w-full"
                  role="table"
                  aria-label="User management table"
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        scope="col"
                      >
                        {isArabic ? "المستخدم" : "User"}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        scope="col"
                      >
                        {isArabic ? "الدور" : "Role"}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        scope="col"
                      >
                        {isArabic ? "القسم" : "Department"}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        scope="col"
                      >
                        {isArabic ? "آخر دخول" : "Last Login"}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        scope="col"
                      >
                        {isArabic ? "الحالة" : "Status"}
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        scope="col"
                      >
                        {isArabic ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4" role="cell">
                          <div>
                            <div className="font-medium text-gray-900">
                              {isArabic ? user.nameAr : user.nameEn}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-4 py-4 text-sm text-gray-900"
                          role="cell"
                        >
                          {user.role}
                        </td>
                        <td
                          className="px-4 py-4 text-sm text-gray-900"
                          role="cell"
                        >
                          {user.department}
                        </td>
                        <td
                          className="px-4 py-4 text-sm text-gray-900"
                          role="cell"
                        >
                          {user.lastLogin}
                        </td>
                        <td className="px-4 py-4" role="cell">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-4" role="cell">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label={`View ${user.nameEn} details`}
                            >
                              <Eye className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              className="text-green-600 hover:text-green-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                              aria-label={`Edit ${user.nameEn}`}
                            >
                              <Edit className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                              aria-label={`Delete ${user.nameEn}`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {roles.map((role, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isArabic ? role.nameAr : role.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {isArabic ? role.descriptionAr : role.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {role.userCount}
                        </div>
                        <div className="text-sm text-blue-700">
                          {isArabic ? "مستخدم" : "Users"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {isArabic ? "الصلاحيات:" : "Permissions:"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission, permIndex) => (
                          <span
                            key={permIndex}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "إدارة الصلاحيات" : "Permission Management"}
                </h3>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "تحديد الصلاحيات لكل دور في النظام"
                    : "Configure permissions for each role in the system"}
                </p>
              </div>

              <div className="space-y-4">
                {permissions.map((module, moduleIndex) => (
                  <div
                    key={moduleIndex}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {isArabic ? module.moduleAr : module.module}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {module.permissions.map((permission, permIndex) => (
                        <div
                          key={permIndex}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-700">
                            {isArabic ? permission.nameAr : permission.name}
                          </span>
                          <div className="flex items-center">
                            {permission.granted ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إضافة مستخدم جديد" : "Add New User"}
              </h3>
              <button
                onClick={() => setShowCreateUser(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم المستخدم" : "Username"}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الدور" : "Role"}
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Select Role</option>
                    <option value="hr_manager">HR Manager</option>
                    <option value="operations_supervisor">
                      Operations Supervisor
                    </option>
                    <option value="finance_clerk">Finance Clerk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "القسم" : "Department"}
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Select Department</option>
                    <option value="hr">Human Resources</option>
                    <option value="operations">Operations</option>
                    <option value="finance">Finance</option>
                    <option value="it">IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "كلمة المرور" : "Password"}
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                  {isArabic ? "إنشاء المستخدم" : "Create User"}
                </button>
                <button
                  onClick={() => setShowCreateUser(false)}
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
