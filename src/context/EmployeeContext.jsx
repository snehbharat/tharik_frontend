// context/EmployeeContext.js
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { employeeService } from "../services/EmployeeService";

// Action types
const EMPLOYEE_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_EMPLOYEES: "SET_EMPLOYEES",
  ADD_EMPLOYEE: "ADD_EMPLOYEE",
  UPDATE_EMPLOYEE: "UPDATE_EMPLOYEE",
  DELETE_EMPLOYEE: "DELETE_EMPLOYEE",
  SET_DEPARTMENTS: "SET_DEPARTMENTS",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_FILTERS: "CLEAR_FILTERS",
  SET_SUCCESS_MESSAGE: "SET_SUCCESS_MESSAGE",
  CLEAR_SUCCESS_MESSAGE: "CLEAR_SUCCESS_MESSAGE",
};

// Initial state
const initialState = {
  employees: [],
  departments: [],
  loading: false,
  error: null,
  filters: {
    searchTerm: "",
    department: "",
    status: "",
    jobTitle: "",
    location: "",
  },
  successMessage: "",
  selectedEmployee: null,
};

// Reducer
const employeeReducer = (state, action) => {
  switch (action.type) {
    case EMPLOYEE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case EMPLOYEE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case EMPLOYEE_ACTIONS.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
        loading: false,
        error: null,
      };

    case EMPLOYEE_ACTIONS.ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload],
        loading: false,
        error: null,
      };

    case EMPLOYEE_ACTIONS.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        ),
        loading: false,
        error: null,
      };

    case EMPLOYEE_ACTIONS.DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter((emp) => emp.id !== action.payload),
        loading: false,
        error: null,
      };

    case EMPLOYEE_ACTIONS.SET_DEPARTMENTS:
      return {
        ...state,
        departments: action.payload,
        loading: false,
        error: null,
      };

    case EMPLOYEE_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case EMPLOYEE_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
      };

    case EMPLOYEE_ACTIONS.SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload };

    case EMPLOYEE_ACTIONS.CLEAR_SUCCESS_MESSAGE:
      return { ...state, successMessage: "" };

    default:
      return state;
  }
};

// Create contexts
const EmployeeStateContext = createContext();
const EmployeeDispatchContext = createContext();

// Provider component
export const EmployeeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  return (
    <EmployeeStateContext.Provider value={state}>
      <EmployeeDispatchContext.Provider value={dispatch}>
        {children}
      </EmployeeDispatchContext.Provider>
    </EmployeeStateContext.Provider>
  );
};

// Custom hooks to use the contexts
export const useEmployeeState = () => {
  const context = useContext(EmployeeStateContext);
  if (context === undefined) {
    throw new Error("useEmployeeState must be used within an EmployeeProvider");
  }
  return context;
};

export const useEmployeeDispatch = () => {
  const context = useContext(EmployeeDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useEmployeeDispatch must be used within an EmployeeProvider"
    );
  }
  return context;
};

// Action creators and business logic hooks
export const useEmployeeActions = () => {
  const dispatch = useEmployeeDispatch();

  const setLoading = useCallback(
    (loading) => {
      dispatch({ type: EMPLOYEE_ACTIONS.SET_LOADING, payload: loading });
    },
    [dispatch]
  );

  const setError = useCallback(
    (error) => {
      dispatch({ type: EMPLOYEE_ACTIONS.SET_ERROR, payload: error });
    },
    [dispatch]
  );

  const setSuccessMessage = useCallback(
    (message) => {
      dispatch({
        type: EMPLOYEE_ACTIONS.SET_SUCCESS_MESSAGE,
        payload: message,
      });
    },
    [dispatch]
  );

  const clearSuccessMessage = useCallback(() => {
    dispatch({ type: EMPLOYEE_ACTIONS.CLEAR_SUCCESS_MESSAGE });
  }, [dispatch]);

  const fetchEmployees = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        const response = await employeeService.getAllEmployees(filters);
        dispatch({
          type: EMPLOYEE_ACTIONS.SET_EMPLOYEES,
          payload: response.data || response,
        });
      } catch (error) {
        setError(error.message);
      }
    },
    [setLoading, setError, dispatch]
  );

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAllDepartments();
      dispatch({
        type: EMPLOYEE_ACTIONS.SET_DEPARTMENTS,
        payload: response.data || response,
      });
    } catch (error) {
      setError(error.message);
    }
  }, [setLoading, setError, dispatch]);

  const createEmployee = useCallback(
    async (employeeData) => {
      try {
        setLoading(true);
        await employeeService.createEmployee(employeeData);

        // Instead of adding one employee manually, fetch the updated list
        await fetchEmployees();

        setSuccessMessage("Employee created successfully!");
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setSuccessMessage, fetchEmployees]
  );

  const updateEmployee = useCallback(
    async (employeeId, employeeData) => {
      try {
        setLoading(true);
        await employeeService.updateEmployee(employeeId, employeeData);

        // Refresh list after update
        await fetchEmployees();

        setSuccessMessage("Employee updated successfully!");
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setSuccessMessage, fetchEmployees]
  );

  const deleteEmployee = useCallback(
    async (employeeId) => {
      try {
        setLoading(true);
        await employeeService.deleteEmployee(employeeId);
        dispatch({
          type: EMPLOYEE_ACTIONS.DELETE_EMPLOYEE,
          payload: employeeId,
        });
        setSuccessMessage("Employee deleted successfully!");
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setLoading, setError, setSuccessMessage, dispatch]
  );

  const exportEmployees = useCallback(
    async (format = "csv", filters = {}) => {
      try {
        setLoading(true);
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

        setSuccessMessage("Employee data exported successfully!");
        setLoading(false);
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setLoading, setError, setSuccessMessage]
  );

  const importEmployees = useCallback(
    async (file) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        const response = await employeeService.importEmployeeData(formData);

        // Refresh employee list
        await fetchEmployees();
        setSuccessMessage(
          `Successfully imported ${response.imported || 0} employees!`
        );

        return response;
      } catch (error) {
        setError(error.message);
        throw error;
      }
    },
    [setLoading, setError, setSuccessMessage, fetchEmployees]
  );

  const updateFilters = useCallback(
    (newFilters) => {
      dispatch({ type: EMPLOYEE_ACTIONS.SET_FILTERS, payload: newFilters });
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch({ type: EMPLOYEE_ACTIONS.CLEAR_FILTERS });
  }, [dispatch]);

  return {
    fetchEmployees,
    fetchDepartments,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    exportEmployees,
    importEmployees,
    updateFilters,
    clearFilters,
    setSuccessMessage,
    clearSuccessMessage,
    setError,
    setLoading,
  };
};

// Combined hook for easier usage
export const useEmployeeManagement = () => {
  const state = useEmployeeState();
  const actions = useEmployeeActions();

  return {
    ...state,
    ...actions,
  };
};
