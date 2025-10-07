import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Building2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const LoginForm = ({
  onSuccess,
  redirectTo = "/dashboard",
  isArabic = false,
}) => {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "",
    rememberMe: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || redirectTo;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state, redirectTo]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || isLoading) return;

    setValidationErrors([]);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await login(credentials);

      if (success) {
        setLoginSuccess(true);

        if (onSuccess) {
          onSuccess();
        } else {
          const from = location.state?.from?.pathname || redirectTo;
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error("Login submission error:", error);
      setValidationErrors([
        isArabic ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const fillDemoCredentials = (userRole) => {
    console.log(userRole);

    const demoCredentials = {
      admin: {
        username: "admin@amoagc.sa",
        password: "AhmedAlRashid123",
        role: userRole.role,
      },
      HR_Manager: {
        username: "hr@amoagc.sa",
        password: "FatimaAlZahra123",
        role: userRole.role,
      },
      Operations_Supervisor: {
        username: "op@amoagc.sa",
        password: "AliAlMahmoud123",
        role: userRole.role,
      },
      Finance_Clerk: {
        username: "fc@amoagc.sa",
        password: "HassanAlMutairi123",
        role: userRole.role,
      },
    };

    setCredentials((prev) => ({
      ...prev,
      ...demoCredentials[userRole.key],
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting && !isLoading) {
      handleSubmit(e);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!credentials.username?.trim()) {
      errors.push(isArabic ? "اسم المستخدم مطلوب" : "Username is required");
    } else if (credentials.username.length < 3) {
      errors.push(
        isArabic
          ? "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"
          : "Username must be at least 3 characters"
      );
    }

    if (!credentials.password?.trim()) {
      errors.push(isArabic ? "كلمة المرور مطلوبة" : "Password is required");
    } else if (credentials.password.length < 6) {
      errors.push(
        isArabic
          ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
          : "Password must be at least 6 characters"
      );
    }

    const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
    const inputText = credentials.username + credentials.password;

    if (dangerousPatterns.some((pattern) => pattern.test(inputText))) {
      errors.push(isArabic ? "أحرف غير صالحة" : "Invalid characters detected");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 ${
        isArabic ? "rtl" : "ltr"
      }`}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isArabic ? "أموجك" : "AMOAGC"}
          </h1>
          <p className="text-gray-600">
            {isArabic
              ? "العمليات والمقاولات العامة"
              : "Operations & General Contracting"}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isArabic ? "تسجيل الدخول" : "Sign In"}
            </h2>
            <p className="text-gray-600">
              {isArabic
                ? "أدخل بياناتك للوصول إلى النظام"
                : "Enter your credentials to access the system"}
            </p>
          </div>

          {loginSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                {isArabic
                  ? "تم تسجيل الدخول بنجاح! جاري التحويل..."
                  : "Login successful! Redirecting..."}
              </span>
            </div>
          )}

          {(error || validationErrors.length > 0) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  {isArabic ? "خطأ في تسجيل الدخول" : "Login Error"}
                </span>
              </div>
              {error && <p className="text-red-700 text-sm mb-2">{error}</p>}
              {validationErrors.map((err, index) => (
                <p key={index} className="text-red-700 text-sm">
                  {err}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "اسم المستخدم" : "Username"}
              </label>
              <div className="relative">
                <User
                  className={`w-5 h-5 absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${
                    isArabic ? "right-3" : "left-3"
                  }`}
                />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className={`w-full border border-gray-300 rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    isArabic ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                  }`}
                  placeholder={
                    isArabic ? "أدخل اسم المستخدم" : "Enter your username"
                  }
                  disabled={isSubmitting || loginSuccess || isLoading}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <Lock
                  className={`w-5 h-5 absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${
                    isArabic ? "right-3" : "left-3"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full border border-gray-300 rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    isArabic
                      ? "pr-10 pl-10 text-right"
                      : "pl-10 pr-10 text-left"
                  }`}
                  placeholder={
                    isArabic ? "أدخل كلمة المرور" : "Enter your password"
                  }
                  disabled={isSubmitting || loginSuccess || isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                    isArabic ? "left-3" : "right-3"
                  }`}
                  disabled={isSubmitting || loginSuccess || isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={(e) =>
                    handleInputChange("rememberMe", e.target.checked)
                  }
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled={isSubmitting || loginSuccess || isLoading}
                />
                <span
                  className={`text-sm text-gray-600 ${
                    isArabic ? "mr-2" : "ml-2"
                  }`}
                >
                  {isArabic ? "تذكرني" : "Remember me"}
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-800 font-medium"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                {isArabic ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                loginSuccess ||
                isLoading ||
                !credentials.username.trim() ||
                !credentials.password.trim()
              }
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isArabic ? "جاري تسجيل الدخول..." : "Signing in..."}
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {isArabic ? "تم بنجاح!" : "Success!"}
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  {isArabic ? "تسجيل الدخول" : "Sign In"}
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">
              {isArabic
                ? "بيانات تجريبية للاختبار:"
                : "Demo credentials for testing:"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  fillDemoCredentials({ role: "admin", key: "admin" })
                }
                className="text-xs bg-red-100 text-red-800 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                {isArabic ? "مدير النظام" : "Admin"}
              </button>
              <button
                onClick={() =>
                  fillDemoCredentials({ role: "HR Manager", key: "HR_Manager" })
                }
                className="text-xs bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                {isArabic ? "الموارد البشرية" : "HR Manager"}
              </button>
              <button
                onClick={() =>
                  fillDemoCredentials({
                    role: "Operations Supervisor",
                    key: "Operations_Supervisor",
                  })
                }
                className="text-xs bg-green-100 text-green-800 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                {isArabic ? "مشرف العمليات" : "Operations"}
              </button>
              <button
                onClick={() =>
                  fillDemoCredentials({
                    role: "Finance Clerk",
                    key: "Finance_Clerk",
                  })
                }
                className="text-xs bg-purple-100 text-purple-800 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                {isArabic ? "المالية" : "Finance"}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {isArabic ? "إشعار أمني" : "Security Notice"}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {isArabic
                ? "جلستك محمية بتشفير متقدم ومصادقة آمنة. سيتم تسجيل خروجك تلقائياً بعد 8 ساعات من عدم النشاط."
                : "Your session is protected with advanced encryption and secure authentication. You will be automatically logged out after 8 hours of inactivity."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            {isArabic
              ? "© 2024 أموجك المجمعة. جميع الحقوق محفوظة."
              : "© 2024 AMOAGC Al-Majmaah. All rights reserved."}
          </p>
        </div>
      </div>
    </div>
  );
};
