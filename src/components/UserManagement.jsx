import React, { useEffect, useState } from "react";
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
import UserService from "../services/UserService";

export const UserManagement = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    username: "",
    email: "",
    mobile_number: "",
    role: "",
    department: "",
    password: "",
    status: "",
  });
  const [editUserForm, setEditUserForm] = useState({
    nameEn: "",
    nameAr: "",
    username: "",
    email: "",
    mobile_number: "",
    role: "",
    department: "",
    status: "",
  });

  // 🔹 Fetch Users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await UserService.getAllUsers();

      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  console.log("user", users);

  // const users = [
  //   {
  //     id: 1,
  //     username: "admin",
  //     nameEn: "System Administrator",
  //     nameAr: "مدير النظام",
  //     email: "admin@amoagc.sa",
  //     phone: "+966501234567",
  //     role: "Super Admin",
  //     department: "IT",
  //     status: "Active",
  //     lastLogin: "2024-12-15 09:30",
  //     createdDate: "2024-01-15",
  //     permissions: ["All"],
  //   },
  //   {
  //     id: 2,
  //     username: "hr.manager",
  //     nameEn: "Fatima Al-Zahra",
  //     nameAr: "فاطمة الزهراء",
  //     email: "hr@amoagc.sa",
  //     phone: "+966502345678",
  //     role: "HR Manager",
  //     department: "Human Resources",
  //     status: "Active",
  //     lastLogin: "2024-12-15 08:45",
  //     createdDate: "2024-02-01",
  //     permissions: ["HR Management", "Payroll", "Employee Records"],
  //   },
  //   {
  //     id: 3,
  //     username: "ops.supervisor",
  //     nameEn: "Ahmed Al-Rashid",
  //     nameAr: "أحمد الراشد",
  //     email: "operations@amoagc.sa",
  //     phone: "+966503456789",
  //     role: "Operations Supervisor",
  //     department: "Operations",
  //     status: "Active",
  //     lastLogin: "2024-12-14 16:20",
  //     createdDate: "2024-03-15",
  //     permissions: [
  //       "Project Management",
  //       "Manpower Assignment",
  //       "Fleet Management",
  //     ],
  //   },
  //   {
  //     id: 4,
  //     username: "finance.clerk",
  //     nameEn: "Mohammad Hassan",
  //     nameAr: "محمد حسن",
  //     email: "finance@amoagc.sa",
  //     phone: "+966504567890",
  //     role: "Finance Clerk",
  //     department: "Finance",
  //     status: "Inactive",
  //     lastLogin: "2024-12-10 14:15",
  //     createdDate: "2024-04-01",
  //     permissions: ["Invoice Management", "Financial Reports"],
  //   },
  // ];

  // 🔹 Handle Create User with Validation

  const handleCreateUser = async () => {
    // Simple validation checks
    if (!formData.nameEn.trim()) {
      alert("Name (English) is required");
      return;
    }
    if (!formData.nameAr.trim()) {
      alert("Name (Arabic) is required");
      return;
    }
    if (!formData.username.trim()) {
      alert("Username is required");
      return;
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      alert("Valid email is required");
      return;
    }
    if (
      !formData.mobile_number.trim() ||
      !/^\d{10,15}$/.test(formData.mobile_number)
    ) {
      alert("Valid phone number is required (10–15 digits)");
      return;
    }
    if (!formData.role) {
      alert("Role is required");
      return;
    }
    if (!formData.department) {
      alert("Department is required");
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (!formData.status) {
      alert("Status is required");
      return;
    }
    console.log("formdata", formData);

    try {
      await UserService.createUser(formData);
      fetchUsers();
      setShowCreateUser(false);
      setFormData({
        nameEn: "",
        nameAr: "",
        username: "",
        email: "",
        mobile_number: "",
        role: "",
        department: "",
        password: "",
        status: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditUserForm(user); // preload form
  };

  const handleUpdateUser = async () => {
    try {
      if (
        !editUserForm.nameEn ||
        !editUserForm.username ||
        !editUserForm.email
      ) {
        alert("Name, Username, and Email are required");
        return;
      }

      await UserService.updateUser(editUser._id, editUserForm);
      fetchUsers();
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await UserService.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const roles = [
    {
      name: "admin",
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
      description: "workforce management",
      descriptionAr: "إدارة المشاريع والقوى العاملة",
      userCount: 3,
      permissions: ["Manpower Assignment", "Fleet Tracking"],
    },
    {
      name: "Project Supervisor",
      nameAr: "مشرف المشروع",
      description: "Project management",
      descriptionAr: "إدارة القوى العاملة",
      userCount: 3,
      permissions: ["Project Management"],
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

  const updatedRoles = roles.map((role) => {
    const count =
      users?.filter(
        (user) => user.role?.toLowerCase() === role.name.toLowerCase()
      ).length || 0;

    return { ...role, userCount: count };
  });

  console.log(updatedRoles);

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
      case "active":
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
          <div className="text-2xl font-bold text-blue-600">
            {users ? users.length : 0}
          </div>
          <div className="text-sm text-blue-700">
            {isArabic ? "إجمالي المستخدمين" : "Total Users"}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {users?.filter((user) => user.status === "active").length || 0}
          </div>
          <div className="text-sm text-green-700">
            {isArabic ? "المستخدمون النشطون" : "Active Users"}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {roles.length}
          </div>
          <div className="text-sm text-yellow-700">
            {isArabic ? "الأدوار" : "Roles"}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {users?.filter((user) => {
              if (!user.last_login) return false;
              const loginDate = new Date(user.last_login).toLocaleDateString(
                "en-GB"
              );
              const today = new Date().toLocaleDateString("en-GB");
              return loginDate === today;
            }).length || 0}
          </div>
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
                      <tr key={user._id} className="hover:bg-gray-50">
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
                          {user.department ? user.department : "NA"}
                        </td>
                        <td
                          className="px-4 py-4 text-sm text-gray-900"
                          role="cell"
                        >
                          {user.last_login
                            ? new Date(user.last_login).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "NA"}
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
                              onClick={() => setViewUser(user)}
                            >
                              <Eye className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              className="text-green-600 hover:text-green-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                              aria-label={`Edit ${user.nameEn}`}
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                              aria-label={`Delete ${user.nameEn}`}
                              onClick={() => handleDeleteUser(user._id)}
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
                {updatedRoles.map((role, index) => (
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
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) =>
                      setFormData({ ...formData, nameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Username + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم المستخدم" : "Username"}
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Phone + Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mobile_number: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الدور" : "Role"}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Role</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Operations Supervisor">
                      Operations Supervisor
                    </option>
                    <option value="Finance Clerk">Finance Clerk</option>
                    <option value="Project Supervisor">
                      Project Supervisor
                    </option>
                  </select>
                </div>
              </div>

              {/* Department + Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "القسم" : "Department"}
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Department</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "كلمة المرور" : "Password"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الحالة" : "Status"}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCreateUser}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
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

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isArabic ? "تفاصيل المستخدم" : "User Details"}
              </h3>
              <button
                onClick={() => setViewUser(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewUser.nameEn}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "اسم المستخدم" : "Username"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewUser.username}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewUser.mobile_number}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "القسم" : "Department"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewUser.department}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewUser.nameAr}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewUser.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "الدور" : "Role"}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {viewUser.role}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {isArabic ? "الحالة" : "Status"}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      viewUser.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {viewUser.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t mt-6 pt-4 grid grid-cols-2 gap-6 text-sm text-gray-600">
              <p>
                <span className="font-semibold">
                  {isArabic ? "تاريخ الإنشاء: " : "Created At: "}
                </span>
                {new Date(viewUser.created_at).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">
                  {isArabic ? "آخر تحديث: " : "Updated At: "}
                </span>
                {new Date(viewUser.updated_at).toLocaleString()}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setViewUser(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isArabic ? "تحديث المستخدم" : "Update User"}
              </h3>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Update Form */}
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={editUserForm.nameEn}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        nameEn: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editUserForm.nameAr}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        nameAr: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Username + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم المستخدم" : "Username"}
                  </label>
                  <input
                    type="text"
                    value={editUserForm.username}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        username: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Phone + Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={editUserForm.mobile_number}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        mobile_number: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الدور" : "Role"}
                  </label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) =>
                      setEditUserForm({ ...editUserForm, role: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Role</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Operations Supervisor">
                      Operations Supervisor
                    </option>
                    <option value="Finance Clerk">Finance Clerk</option>
                    <option value="Project Supervisor">
                      Project Supervisor
                    </option>
                  </select>
                </div>
              </div>

              {/* Department + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "القسم" : "Department"}
                  </label>
                  <select
                    value={editUserForm.department}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        department: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Department</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الحالة" : "Status"}
                  </label>
                  <select
                    value={editUserForm.status}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="active">
                      {isArabic ? "نشط" : "Active"}
                    </option>
                    <option value="inactive">
                      {isArabic ? "غير نشط" : "Inactive"}
                    </option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={() => setEditUser(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "تحديث" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
