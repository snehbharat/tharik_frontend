// Centralized error handling utilities

class ErrorHandler {
  static createError(code, message, details) {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }

  static handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      return this.createError(
        `API_ERROR_${error.response.status}`,
        error.response.data?.message || "Server error occurred",
        error.response.data
      );
    } else if (error.request) {
      // Request made but no response
      return this.createError(
        "NETWORK_ERROR",
        "Unable to connect to server. Please check your internet connection.",
        error.request
      );
    } else {
      // Something else happened
      return this.createError(
        "UNKNOWN_ERROR",
        error.message || "An unexpected error occurred",
        error
      );
    }
  }

  static handleValidationError(field, message) {
    return this.createError("VALIDATION_ERROR", `${field}: ${message}`, {
      field,
      validationMessage: message,
    });
  }

  static logError(error) {
    console.error(`[${error.code}] ${error.message}`, error.details);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      // Send to error tracking service (e.g., Sentry)
      // this.sendToErrorTracking(error);
    }
  }

  static getErrorMessage(error) {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return "An unexpected error occurred";
  }

  static isNetworkError(error) {
    return (
      error?.code === "NETWORK_ERROR" ||
      error?.message?.includes("fetch") ||
      error?.message?.includes("network")
    );
  }

  static isValidationError(error) {
    return (
      error?.code === "VALIDATION_ERROR" || error?.response?.status === 400
    );
  }

  static isAuthError(error) {
    return (
      error?.response?.status === 401 ||
      error?.response?.status === 403 ||
      error?.code === "AUTH_ERROR"
    );
  }
}

// React hook for error handling
const useErrorHandler = () => {
  const handleError = (error, context) => {
    const appError = ErrorHandler.handleApiError(error);
    ErrorHandler.logError(appError);

    // Show user-friendly error message
    if (ErrorHandler.isNetworkError(appError)) {
      alert(
        "Network error: Please check your internet connection and try again."
      );
    } else if (ErrorHandler.isAuthError(appError)) {
      alert("Authentication error: Please log in again.");
      // Redirect to login
      window.location.href = "/login";
    } else if (ErrorHandler.isValidationError(appError)) {
      alert(`Validation error: ${appError.message}`);
    } else {
      alert(`Error: ${appError.message}`);
    }

    return appError;
  };

  return { handleError };
};

export { ErrorHandler, useErrorHandler };
