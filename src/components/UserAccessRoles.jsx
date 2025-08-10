import React, { useState } from "react";
import {
  Shield,
  Users,
  Eye,
  EyeOff,
  Key,
  Settings,
  CheckCircle,
  XCircle,
  User,
  Crown,
  Briefcase,
  UserCheck,
  Truck,
  Plus,
  Edit,
  Save,
  X,
} from "lucide-react";

export const UserAccessRoles = ({ isArabic }) => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState({});
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState("");
  const [newRole, setNewRole] = useState({
    id: "",
    nameEn: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    permissions: {},
  });

  const roleTypes = [
    {
      id: "admin",
      nameEn: "Admin",
      nameAr: "مدير النظام",
      icon: Crown,
      color: "bg-red-100 text-red-800 border-red-200",
      description: "Full system access with all permissions",
      descriptionAr: "وصول كامل للنظام مع جميع الصلاحيات",
      userCount: 2,
    },
    {
      id: "sales_manager",
      nameEn: "Sales Manager",
      nameAr: "مدير المبيعات",
      icon: Briefcase,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Lead management and client relations",
      descriptionAr: "إدارة العملاء المحتملين وعلاقات العملاء",
      userCount: 3,
    },
    {
      id: "hr_officer",
      nameEn: "HR Officer",
      nameAr: "موظف الموارد البشرية",
      icon: UserCheck,
      color: "bg-green-100 text-green-800 border-green-200",
      description: "Employee management and payroll",
      descriptionAr: "إدارة الموظفين والرواتب",
      userCount: 4,
    },
    {
      id: "operations",
      nameEn: "Operations",
      nameAr: "العمليات",
      icon: Settings,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      description: "Project management and task coordination",
      descriptionAr: "إدارة المشاريع وتنسيق المهام",
      userCount: 6,
    },
    {
      id: "driver_worker",
      nameEn: "Driver/Worker",
      nameAr: "سائق/عامل",
      icon: Truck,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "Field operations and task updates",
      descriptionAr: "العمليات الميدانية وتحديثات المهام",
      userCount: 45,
    },
  ];

  const [modulePermissions, setModulePermissions] = useState([
    {
      module: "Dashboard",
      moduleAr: "لوحة التحكم",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: true, create: false, edit: false, delete: false },
        operations: { view: true, create: false, edit: false, delete: false },
        driver_worker: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
      },
    },
    {
      module: "Company Management",
      moduleAr: "إدارة الشركة",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: false, create: false, edit: false, delete: false },
        operations: { view: true, create: false, edit: false, delete: false },
        driver_worker: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
      },
    },
    {
      module: "Lead Management",
      moduleAr: "إدارة العملاء المحتملين",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: { view: true, create: true, edit: true, delete: false },
        hr_officer: { view: false, create: false, edit: false, delete: false },
        operations: { view: true, create: false, edit: false, delete: false },
        driver_worker: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
      },
    },
    {
      module: "Manpower Management",
      moduleAr: "إدارة القوى العاملة",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: true, create: true, edit: true, delete: false },
        operations: { view: true, create: false, edit: true, delete: false },
        driver_worker: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
      },
    },
    {
      module: "Fleet Management",
      moduleAr: "إدارة الأسطول",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: false, create: false, edit: false, delete: false },
        operations: { view: true, create: false, edit: true, delete: false },
        driver_worker: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
      },
    },
    {
      module: "Task Management",
      moduleAr: "إدارة المهام",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: false, create: false, edit: false, delete: false },
        operations: { view: true, create: true, edit: true, delete: false },
        driver_worker: { view: true, create: false, edit: true, delete: false },
      },
    },
    {
      module: "Work Progress",
      moduleAr: "تقدم العمل",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: false, create: false, edit: false, delete: false },
        operations: { view: true, create: false, edit: true, delete: false },
        driver_worker: { view: true, create: true, edit: false, delete: false },
      },
    },
    {
      module: "Payroll Management",
      moduleAr: "إدارة الرواتب",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: true, create: true, edit: true, delete: false },
        operations: { view: false, create: false, edit: false, delete: false },
        driver_worker: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
      },
    },
    {
      module: "Financial Reports",
      moduleAr: "التقارير المالية",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: false, create: false, edit: false, delete: false },
        operations: { view: false, create: false, edit: false, delete: false },
        driver_worker: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
      },
    },
    {
      module: "System Setup",
      moduleAr: "إعدادات النظام",
      permissions: {
        admin: { view: true, create: true, edit: true, delete: true },
        sales_manager: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        hr_officer: { view: false, create: false, edit: false, delete: false },
        operations: { view: false, create: false, edit: false, delete: false },
        driver_worker: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
      },
    },
  ]);

  // Initialize edited permissions when entering edit mode
  const initializeEditMode = () => {
    const currentPermissions = {};
    modulePermissions.forEach((module) => {
      currentPermissions[module.module] = {
        ...module.permissions[selectedRole],
      };
    });
    setEditedPermissions(currentPermissions);
    setIsEditingPermissions(true);
  };

  // Save permission changes
  const savePermissionChanges = () => {
    const updatedModules = modulePermissions.map((module) => ({
      ...module,
      permissions: {
        ...module.permissions,
        [selectedRole]:
          editedPermissions[module.module] || module.permissions[selectedRole],
      },
    }));

    setModulePermissions(updatedModules);
    setIsEditingPermissions(false);
    setEditedPermissions({});
    alert(
      isArabic ? "تم حفظ التغييرات بنجاح!" : "Permissions updated successfully!"
    );
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditingPermissions(false);
    setEditedPermissions({});
  };

  // Toggle permission
  const togglePermission = (module, permissionType) => {
    if (!isEditingPermissions) return;

    setEditedPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permissionType]: !prev[module]?.[permissionType],
      },
    }));
  };

  // Create new role
  const handleCreateRole = () => {
    if (!newRole.nameEn || !newRole.id) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    // Initialize permissions for new role
    const defaultPermissions = {};
    modulePermissions.forEach((module) => {
      defaultPermissions[module.module] = {
        view: false,
        create: false,
        edit: false,
        delete: false,
      };
    });

    const updatedModules = modulePermissions.map((module) => ({
      ...module,
      permissions: {
        ...module.permissions,
        [newRole.id]: defaultPermissions[module.module],
      },
    }));

    setModulePermissions(updatedModules);
    setNewRole({
      id: "",
      nameEn: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      permissions: {},
    });
    setShowCreateRole(false);
    alert(isArabic ? "تم إنشاء الدور بنجاح!" : "Role created successfully!");
  };

  // Edit existing role
  const handleEditRole = (roleId) => {
    const role = roleTypes.find((r) => r.id === roleId);
    if (role) {
      setNewRole({
        id: role.id,
        nameEn: role.nameEn,
        nameAr: role.nameAr,
        description: role.description,
        descriptionAr: role.descriptionAr,
        permissions: {},
      });
      setEditingRoleId(roleId);
      setShowEditRole(true);
    }
  };

  // Save role changes
  const saveRoleChanges = () => {
    // In a real implementation, this would update the role in the database
    setShowEditRole(false);
    setEditingRoleId("");
    alert(isArabic ? "تم تحديث الدور بنجاح!" : "Role updated successfully!");
  };
  const getPermissionIcon = (hasPermission) => {
    return hasPermission ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const selectedRoleData = roleTypes.find((role) => role.id === selectedRole);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "نظام الوصول والأدوار" : "User Access & Roles System"}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Shield className="w-4 h-4" />
            {isArabic ? "إعدادات الأمان" : "Security Settings"}
          </button>
          <button
            onClick={() => setShowCreateRole(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "إنشاء دور جديد" : "Create New Role"}
          </button>
          <button
            onClick={
              isEditingPermissions ? savePermissionChanges : initializeEditMode
            }
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              isEditingPermissions
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-yellow-600 hover:bg-yellow-700 text-white"
            }`}
          >
            <Key className="w-4 h-4" />
            {isEditingPermissions
              ? isArabic
                ? "حفظ التغييرات"
                : "Save Changes"
              : isArabic
              ? "تعديل الصلاحيات"
              : "Edit Permissions"}
          </button>
          {isEditingPermissions && (
            <button
              onClick={cancelEditing}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          )}
        </div>
      </div>

      {/* Role Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {roleTypes.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`rounded-lg p-6 border-2 cursor-pointer transition-all ${
                selectedRole === role.id
                  ? role.color + " shadow-lg transform scale-105"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedRole === role.id
                      ? "bg-white bg-opacity-50"
                      : "bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">
                    {isArabic ? role.nameAr : role.nameEn}
                  </div>
                  <div className="text-sm opacity-75">
                    {role.userCount} {isArabic ? "مستخدم" : "users"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Details */}
      {selectedRoleData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedRoleData.color}`}
            >
              <selectedRoleData.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isArabic
                      ? selectedRoleData.nameAr
                      : selectedRoleData.nameEn}
                  </h2>
                  <p className="text-gray-600">
                    {isArabic
                      ? selectedRoleData.descriptionAr
                      : selectedRoleData.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditRole(selectedRole)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    {isArabic ? "تعديل الدور" : "Edit Role"}
                  </button>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedRoleData.userCount} {isArabic ? "مستخدم" : "users"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Mode Banner */}
          {isEditingPermissions && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-800">
                    {isArabic ? "وضع التعديل نشط" : "Edit Mode Active"}
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {isArabic
                      ? "انقر على الأيقونات لتغيير الصلاحيات. لا تنس حفظ التغييرات."
                      : "Click on permission icons to toggle access. Remember to save your changes."}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Permission Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? "مصفوفة الصلاحيات" : "Permission Matrix"}
              </h3>
              {!isEditingPermissions && (
                <div className="text-sm text-gray-500">
                  {isArabic
                    ? 'للتعديل، انقر على "تعديل الصلاحيات"'
                    : 'Click "Edit Permissions" to modify access'}
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "الوحدة" : "Module"}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "عرض" : "View"}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "إنشاء" : "Create"}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "تعديل" : "Edit"}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      {isArabic ? "حذف" : "Delete"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {modulePermissions.map((module, index) => {
                    // Get rolePermissions safely, considering editedPermissions if editing
                    const rolePermissions = isEditingPermissions
                      ? editedPermissions[module.module] ||
                        module.permissions[selectedRole] ||
                        {}
                      : module.permissions[selectedRole] || {};

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {isArabic ? module.moduleAr : module.module}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() =>
                              togglePermission(module.module, "view")
                            }
                            disabled={!isEditingPermissions}
                            className={`p-1 rounded transition-colors ${
                              isEditingPermissions
                                ? "hover:bg-gray-100 cursor-pointer"
                                : "cursor-default"
                            }`}
                          >
                            {getPermissionIcon(rolePermissions.view)}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() =>
                              togglePermission(module.module, "create")
                            }
                            disabled={!isEditingPermissions}
                            className={`p-1 rounded transition-colors ${
                              isEditingPermissions
                                ? "hover:bg-gray-100 cursor-pointer"
                                : "cursor-default"
                            }`}
                          >
                            {getPermissionIcon(rolePermissions.create)}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() =>
                              togglePermission(module.module, "edit")
                            }
                            disabled={!isEditingPermissions}
                            className={`p-1 rounded transition-colors ${
                              isEditingPermissions
                                ? "hover:bg-gray-100 cursor-pointer"
                                : "cursor-default"
                            }`}
                          >
                            {getPermissionIcon(rolePermissions.edit)}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() =>
                              togglePermission(module.module, "delete")
                            }
                            disabled={!isEditingPermissions}
                            className={`p-1 rounded transition-colors ${
                              isEditingPermissions
                                ? "hover:bg-gray-100 cursor-pointer"
                                : "cursor-default"
                            }`}
                          >
                            {getPermissionIcon(rolePermissions.delete)}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Permission Summary */}
            {isEditingPermissions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "ملخص التغييرات" : "Changes Summary"}
                </h4>
                <div className="text-sm text-blue-700">
                  {Object.keys(editedPermissions).length > 0 ? (
                    <div>
                      {isArabic
                        ? "تم تعديل الصلاحيات لـ"
                        : "Permissions modified for"}{" "}
                      {Object.keys(editedPermissions).length}{" "}
                      {isArabic ? "وحدة" : "modules"}
                    </div>
                  ) : (
                    <div>
                      {isArabic
                        ? "لم يتم إجراء تغييرات بعد"
                        : "No changes made yet"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Features */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isArabic ? "ميزات الأمان المتقدمة" : "Advanced Security Features"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-800">
                {isArabic ? "المصادقة الآمنة" : "Secure Authentication"}
              </h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • {isArabic ? "تشفير كلمات المرور" : "Password encryption"}
              </li>
              <li>
                •{" "}
                {isArabic
                  ? "انتهاء الجلسة التلقائي"
                  : "Automatic session timeout"}
              </li>
              <li>
                • {isArabic ? "تسجيل محاولات الدخول" : "Login attempt logging"}
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-800">
                {isArabic ? "تصفية لوحة التحكم" : "Dashboard Filtering"}
              </h3>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• {isArabic ? "عرض حسب الدور" : "Role-based display"}</li>
              <li>
                • {isArabic ? "إخفاء البيانات الحساسة" : "Hide sensitive data"}
              </li>
              <li>• {isArabic ? "تخصيص الواجهة" : "Customized interface"}</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Key className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-purple-800">
                {isArabic ? "التحكم الدقيق" : "Granular Control"}
              </h3>
            </div>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>
                •{" "}
                {isArabic
                  ? "صلاحيات على مستوى الوحدة"
                  : "Module-level permissions"}
              </li>
              <li>
                • {isArabic ? "تحكم في العمليات" : "Operation-specific access"}
              </li>
              <li>• {isArabic ? "قيود البيانات" : "Data restrictions"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create New Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إنشاء دور جديد" : "Create New Role"}
              </h3>
              <button
                onClick={() => setShowCreateRole(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "معرف الدور" : "Role ID"} *
                  </label>
                  <input
                    type="text"
                    value={newRole.id}
                    onChange={(e) =>
                      setNewRole({ ...newRole, id: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., custom_role"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الدور (إنجليزي)" : "Role Name (English)"} *
                  </label>
                  <input
                    type="text"
                    value={newRole.nameEn}
                    onChange={(e) =>
                      setNewRole({ ...newRole, nameEn: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الدور (عربي)" : "Role Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={newRole.nameAr}
                    onChange={(e) =>
                      setNewRole({ ...newRole, nameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الوصف (إنجليزي)" : "Description (English)"}
                  </label>
                  <input
                    type="text"
                    value={newRole.description}
                    onChange={(e) =>
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف (عربي)" : "Description (Arabic)"}
                </label>
                <textarea
                  value={newRole.descriptionAr}
                  onChange={(e) =>
                    setNewRole({ ...newRole, descriptionAr: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCreateRole}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "إنشاء الدور" : "Create Role"}
                </button>
                <button
                  onClick={() => setShowCreateRole(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "تعديل الدور" : "Edit Role"}
              </h3>
              <button
                onClick={() => setShowEditRole(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {isArabic ? "تعديل معلومات الدور" : "Edit Role Information"}
                </h4>
                <p className="text-sm text-blue-700">
                  {isArabic
                    ? "يمكنك تعديل اسم ووصف الدور. لتعديل الصلاحيات، استخدم مصفوفة الصلاحيات أعلاه."
                    : "You can edit the role name and description. To modify permissions, use the permission matrix above."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الدور (إنجليزي)" : "Role Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={newRole.nameEn}
                    onChange={(e) =>
                      setNewRole({ ...newRole, nameEn: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "اسم الدور (عربي)" : "Role Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={newRole.nameAr}
                    onChange={(e) =>
                      setNewRole({ ...newRole, nameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف (إنجليزي)" : "Description (English)"}
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوصف (عربي)" : "Description (Arabic)"}
                </label>
                <textarea
                  value={newRole.descriptionAr}
                  onChange={(e) =>
                    setNewRole({ ...newRole, descriptionAr: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={saveRoleChanges}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ التغييرات" : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowEditRole(false)}
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
