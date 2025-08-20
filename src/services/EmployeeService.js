import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Employee APIs
export const getEmployees = (page = 1, limit = 10) =>
  axios.get(`${API_URL}/employees?page=${page}&limit=${limit}`);

export const getEmployeeById = (id) => axios.get(`${API_URL}/employees/${id}`);

export const addEmployee = (data) => axios.post(`${API_URL}/employees`, data);

export const updateEmployee = (id, data) =>
  axios.put(`${API_URL}/employees/${id}`, data);

export const deleteEmployee = (id) =>
  axios.delete(`${API_URL}/employees/${id}`);

// Enum APIs
export const getEmployeeRoles = () =>
  axios.get(`${API_URL}/enums/getEmployeeRole`);

export const getNationalities = () =>
  axios.get(`${API_URL}/enums/getNationality`);
