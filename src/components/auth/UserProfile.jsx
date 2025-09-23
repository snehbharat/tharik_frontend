// User Profile Component with Role and Permission Display

import React, { useEffect, useState } from "react";
import {
  User,
  Shield,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Mail,
  Building2,
  Calendar,
  Key,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import UserService from "../../services/UserService";

export const UserProfile = ({ isArabic = false, onClose }) => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!user) return null;

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
  // console.log("users", users);
  // console.log("user", user);

  const matchedUser = users.find((u) => u.email === user.email);
  // console.log("muser", matchedUser?);

  const handleSave = () => {
    // In production, this would make an API call to update user data
    console.log("Saving user profile:", editedUser);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (
      window.confirm(
        isArabic
          ? "هل أنت متأكد من تسجيل الخروج؟"
          : "Are you sure you want to logout?"
      )
    ) {
      await logout();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isArabic ? matchedUser?.nameAr : matchedUser?.nameEn}
                </h2>
                <p className="text-green-100">
                  {isArabic ? matchedUser?.role : matchedUser?.role}
                </p>
                <p className="text-green-200 text-sm">{matchedUser?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                {isEditing ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Edit className="w-5 h-5" />
                )}
              </button> */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {isArabic ? "المعلومات الأساسية" : "Basic Information"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isArabic ? "الاسم الكامل" : "Full Name"}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser?.username || ""}
                    onChange={(e) =>
                      setEditedUser((prev) =>
                        prev ? { ...prev, usermame: e.target.value } : null
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-900">{matchedUser?.nameEn}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isArabic ? "الاسم بالعربية" : "Arabic Name"}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser?.username || ""}
                    onChange={(e) =>
                      setEditedUser((prev) =>
                        prev ? { ...prev, username: e.target.value } : null
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    dir="rtl"
                  />
                ) : (
                  <p className="text-gray-900" dir="">
                    {matchedUser?.nameAr}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isArabic ? "البريد الإلكتروني" : "Email"}
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{matchedUser?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isArabic ? "القسم" : "Department"}
                </label>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{matchedUser?.department}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isArabic ? "آخر دخول" : "Last Login"}
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">
                    {user.last_login
                      ? new Date(matchedUser?.last_login).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isArabic ? "حالة الحساب" : "Account Status"}
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.is_active
                    ? isArabic
                      ? "نشط"
                      : "Active"
                    : isArabic
                    ? "غير نشط"
                    : "Inactive"}
                </span>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ" : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            )}
          </div>

          {/* Role and Permissions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              {isArabic ? "الدور والصلاحيات" : "Role & Permissions"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الدور الوظيفي" : "Role"}
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Key className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {isArabic ? user.role.nameAr : user.role}
                    </p>
                    {/* <p className="text-sm text-gray-600">
                      {isArabic ? "المستوى:" : "Level:"} {user.role.level}
                    </p> */}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الصلاحيات" : "Permissions"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {user.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {permission}
                        </span>
                        {/* <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {permission.action}
                        </span> */}
                      </div>
                      {/* <p className="text-xs text-gray-600 mt-1">
                        {isArabic ? "المورد:" : "Resource:"}{" "}
                        {permission.resource}
                      </p> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          {/* <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              {isArabic ? "إعدادات الأمان" : "Security Settings"}
            </h3>

            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {isArabic
                    ? "تحديث كلمة المرور الخاصة بك"
                    : "Update your account password"}
                </p>
              </button>

              <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {isArabic
                      ? "المصادقة الثنائية"
                      : "Two-Factor Authentication"}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    {isArabic ? "قريباً" : "Coming Soon"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {isArabic
                    ? "تعزيز أمان حسابك"
                    : "Enhance your account security"}
                </p>
              </button>
            </div>
          </div> */}

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              {isArabic ? "تسجيل الخروج" : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
