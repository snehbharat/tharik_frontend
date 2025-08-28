import { useState, useEffect, useCallback } from "react";
import { employeeService } from "../services/EmployeeService";

export const useEmployees = (initialFilters = {}) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAllEmployees(filters);
      setEmployees(response.data || response);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const refetch = useCallback(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch,
  };
};

// hooks/useEmployee.js
export const useEmployee = (employeeId) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployee = useCallback(async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getEmployeeById(employeeId);
      setEmployee(response.data || response);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching employee:", err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const updateEmployee = useCallback(
    async (updateData) => {
      try {
        const response = await employeeService.updateEmployee(
          employeeId,
          updateData
        );
        setEmployee(response.data || response);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [employeeId]
  );

  const deleteEmployee = useCallback(async () => {
    try {
      await employeeService.deleteEmployee(employeeId);
      setEmployee(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [employeeId]);

  return {
    employee,
    loading,
    error,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployee,
  };
};

// hooks/useDepartments.js
export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAllDepartments();
      setDepartments(response.data || response);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const createDepartment = useCallback(async (departmentData) => {
    try {
      const response = await employeeService.createDepartment(departmentData);
      setDepartments((prev) => [...prev, response.data || response]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateDepartment = useCallback(async (departmentId, updateData) => {
    try {
      const response = await employeeService.updateDepartment(
        departmentId,
        updateData
      );
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === departmentId ? response.data || response : dept
        )
      );
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    refetch: fetchDepartments,
  };
};

export const useEnums = () => {
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [rolesResponse, nationalitiesResponse] = await Promise.allSettled([
        employeeService.getEmployeeRoles(),
        employeeService.getNationalities(),
      ]);

      if (rolesResponse.status === "fulfilled" && rolesResponse.value?.data) {
        setEmployeeRoles(rolesResponse.value.data);
      } else {
        console.warn("Failed to load employee roles:", rolesResponse.reason);
      }

      if (
        nationalitiesResponse.status === "fulfilled" &&
        nationalitiesResponse.value?.data
      ) {
        setNationalities(nationalitiesResponse.value.data);
      } else {
        console.warn(
          "Failed to load nationalities:",
          nationalitiesResponse.reason
        );
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching enums:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnums();
  }, [fetchEnums]);

  return {
    employeeRoles,
    nationalities,
    loading,
    error,
    refetch: fetchEnums,
  };
};

// hooks/useEmployeeDocuments.js
export const useEmployeeDocuments = (employeeId) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getEmployeeDocuments(employeeId);
      setDocuments(response.data || response);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = useCallback(
    async (formData) => {
      try {
        setUploading(true);
        setError(null);
        const response = await employeeService.uploadEmployeeDocument(
          employeeId,
          formData
        );
        setDocuments((prev) => [...prev, response.data || response]);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [employeeId]
  );

  const deleteDocument = useCallback(
    async (documentId) => {
      try {
        await employeeService.deleteEmployeeDocument(employeeId, documentId);
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [employeeId]
  );

  return {
    documents,
    loading,
    error,
    uploading,
    uploadDocument,
    deleteDocument,
    refetch: fetchDocuments,
  };
};

// hooks/useEmployeeAnalytics.js
export const useEmployeeAnalytics = (timeRange = "30d") => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getEmployeeAnalytics(timeRange);
      setAnalytics(response.data || response);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};

// hooks/useEmployeeActions.js
export const useEmployeeActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEmployee = useCallback(async (employeeData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.createEmployee(employeeData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportEmployees = useCallback(async (format = "csv", filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await employeeService.exportEmployeeData(format, filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `employees_export_${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const importEmployees = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      const response = await employeeService.importEmployeeData(formData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateEmployees = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.bulkUpdateEmployees(updates);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createEmployee,
    exportEmployees,
    importEmployees,
    bulkUpdateEmployees,
  };
};

// hooks/useSearch.js
export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query, filters = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.searchEmployees(query, filters);
      setResults(response.data || response);
    } catch (err) {
      setError(err.message);
      console.error("Error searching employees:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearSearch,
  };
};
