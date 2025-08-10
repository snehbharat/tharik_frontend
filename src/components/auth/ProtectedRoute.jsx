// Protected Route Component with Permission-Based Access Control

import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader2, Shield, AlertTriangle } from "lucide-react";

export const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requiredRole,
  fallback,
}) => {
  const { isAuthenticated, isLoading, user, hasPermission, hasRole } =
    useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <Loader2
            className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-gray-600">Verifying authentication...</p>
          <span className="sr-only">
            Checking authentication status, please wait...
          </span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    console.warn(
      `Access denied: User ${user?.username} does not have required role: ${requiredRole}`
    );
    return (
      fallback || (
        <div
          className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
          role="alert"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <AlertTriangle
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              aria-hidden="true"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              You don't have the required role to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required role: <span className="font-medium">{requiredRole}</span>
              <br />
              Your role: <span className="font-medium">{user?.role.name}</span>
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label="Go back to previous page"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    );
  }

  // Check permission requirements
  const missingPermissions = requiredPermissions.filter(
    (permission) => !hasPermission(permission)
  );

  if (missingPermissions.length > 0) {
    console.warn(
      `Access denied: User ${user?.username} missing permissions:`,
      missingPermissions
    );
    return (
      fallback || (
        <div
          className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
          role="alert"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <Shield
              className="w-12 h-12 text-yellow-500 mx-auto mb-4"
              aria-hidden="true"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Insufficient Permissions
            </h2>
            <p className="text-gray-600 mb-4">
              You don't have the required permissions to access this page.
            </p>
            <div className="text-sm text-gray-500 text-left">
              <p className="font-medium mb-2">Missing permissions:</p>
              <ul className="list-disc list-inside space-y-1">
                {missingPermissions.map((permission, index) => (
                  <li key={index} className="text-red-600">
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              aria-label="Go back to previous page"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    );
  }

  // Log successful access
  console.log(
    `Access granted to ${user?.username} for route: ${location.pathname}`
  );

  // Render protected content
  return <>{children}</>;
};

// Higher-order component for protecting components
export const withAuth = (Component, requiredPermissions, requiredRole) => {
  return (props) => (
    <ProtectedRoute
      requiredPermissions={requiredPermissions}
      requiredRole={requiredRole}
    >
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Permission-based conditional rendering
export const PermissionGate = ({
  children,
  permissions = [],
  role,
  fallback = null,
}) => {
  const { hasPermission, hasRole } = useAuth();

  const hasRequiredPermissions = permissions.every((permission) =>
    hasPermission(permission)
  );
  const hasRequiredRole = !role || hasRole(role);

  if (hasRequiredPermissions && hasRequiredRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
