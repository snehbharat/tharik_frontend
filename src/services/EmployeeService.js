import axios from "axios";
import { useState } from "react";
import { apiClient } from "./ApiClient";

// const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://31.97.203.245:3001/api";

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
export const getEmployeeRoles = () => apiClient.get(`/enum/getEmployeeRole`);

export const getNationalities = () => apiClient.get(`/enum/getNationality`);

// const [employees] = useState([
//   {
//     id: "emp_001",
//     employeeId: "EMP001",
//     personalInfo: {
//       firstName: "Ahmed",
//       lastName: "Al-Rashid",
//       fullName: "Ahmed Al-Rashid",
//       fullNameAr: "أحمد الراشد",
//       dateOfBirth: "1985-03-15",
//       nationality: "Saudi",
//       nationalId: "1234567890",
//       maritalStatus: "married",
//       gender: "male",
//       personalPhone: "+966501234567",
//       personalEmail: "ahmed.rashid@email.com",
//       homeAddress: {
//         street: "King Fahd Road",
//         city: "Riyadh",
//         state: "Riyadh Province",
//         postalCode: "11564",
//         country: "Saudi Arabia",
//       },
//       languages: [
//         { language: "Arabic", proficiency: "native" },
//         { language: "English", proficiency: "advanced" },
//       ],
//     },
//     professionalInfo: {
//       jobTitle: "Site Supervisor",
//       jobTitleAr: "مشرف موقع",
//       departmentId: "dept_operations",
//       employmentType: "full-time",
//       workLocation: "Dhahran Industrial Complex",
//       hireDate: "2022-03-15",
//       workEmail: "ahmed.rashid@amoagc.sa",
//       workPhone: "+966112345678",
//       salaryInfo: {
//         baseSalary: 8500,
//         currency: "SAR",
//         payFrequency: "monthly",
//         allowances: [
//           {
//             type: "Transportation",
//             amount: 500,
//             isRecurring: true,
//             effectiveDate: "2022-03-15",
//           },
//           {
//             type: "Housing",
//             amount: 1200,
//             isRecurring: true,
//             effectiveDate: "2022-03-15",
//           },
//         ],
//         benefits: [
//           {
//             type: "Health Insurance",
//             description: "Comprehensive medical coverage",
//             effectiveDate: "2022-03-15",
//           },
//           {
//             type: "Life Insurance",
//             description: "2x annual salary coverage",
//             effectiveDate: "2022-03-15",
//           },
//         ],
//         taxInfo: {
//           taxId: "TAX001",
//           taxBracket: "15%",
//           exemptions: 2,
//         },
//       },
//       workSchedule: {
//         scheduleType: "standard",
//         workingDays: [1, 2, 3, 4, 5, 6],
//         startTime: "07:00",
//         endTime: "15:00",
//         breakDuration: 60,
//         overtimeEligible: true,
//       },
//       reportingStructure: {
//         directReports: ["emp_002", "emp_003"],
//         reportsTo: "emp_mgr_001",
//         dotLineReports: [],
//         approvalAuthority: [
//           { type: "overtime", limit: 40 },
//           { type: "leave", limit: 5 },
//         ],
//       },
//     },
//     emergencyContacts: [
//       {
//         id: "ec_001",
//         name: "Fatima Al-Rashid",
//         relationship: "Spouse",
//         phone: "+966501234568",
//         email: "fatima.rashid@email.com",
//         isPrimary: true,
//       },
//     ],
//     documents: [
//       {
//         id: "doc_001",
//         employeeId: "emp_001",
//         name: "Employment Contract",
//         type: "contract",
//         category: "legal",
//         fileName: "contract_emp001.pdf",
//         fileSize: 2048,
//         mimeType: "application/pdf",
//         uploadDate: new Date("2022-03-15"),
//         uploadedBy: "hr_manager",
//         isConfidential: true,
//         accessLevel: "hr-only",
//         version: 1,
//         tags: ["contract", "legal", "signed"],
//         metadata: {
//           keywords: ["employment", "contract", "terms"],
//           confidentialityLevel: "confidential",
//           legalRequirement: true,
//           auditTrail: [],
//         },
//         approvalStatus: "approved",
//         approvedBy: "hr_director",
//         approvedAt: new Date("2022-03-15"),
//       },
//     ],
//     photo:
//       "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
//     customFields: {
//       badgeNumber: "B001",
//       parkingSpot: "A-15",
//       securityClearance: "Level 2",
//     },
//     status: "active",
//     createdAt: new Date("2022-03-15"),
//     updatedAt: new Date("2024-12-15"),
//     createdBy: "hr_system",
//     lastModifiedBy: "hr_manager",
//   },
// ]);

const departments = [
  {
    id: "dept_operations",
    name: "Operations",
    nameAr: "العمليات",
    description: "Field operations and project management",
    headOfDepartment: "emp_mgr_001",
    costCenter: "CC001",
    location: "Main Office",
    budget: 2500000,
    employeeCount: 45,
    isActive: true,
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "dept_hr",
    name: "Human Resources",
    nameAr: "الموارد البشرية",
    description: "Employee management and development",
    headOfDepartment: "emp_hr_001",
    costCenter: "CC002",
    location: "Main Office",
    budget: 800000,
    employeeCount: 8,
    isActive: true,
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "dept_finance",
    name: "Finance",
    nameAr: "المالية",
    description: "Financial management and accounting",
    headOfDepartment: "emp_fin_001",
    costCenter: "CC003",
    location: "Main Office",
    budget: 600000,
    employeeCount: 6,
    isActive: true,
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2024-12-15"),
  },
];

class EmployeeService {
  // constructor(baseURL = "http://localhost:3001/api") {
  //   this.baseURL = baseURL;
  //   this.token = localStorage.getItem("authToken"); // Assuming JWT token storage
  // }

  constructor(baseURL = "http://31.97.203.245:3001/api") {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("authToken"); // Assuming JWT token storage
  }

  // Helper method for API calls
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token ? `Bearer ${this.token}` : "",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getEmployeeRoles() {
    return await apiClient.get(`/enum/getEmployeeRole`);
  }

  async getNationalities() {
    return await apiClient.get(`/enum/getNationality`);
  }

  async getTeamsForEmployee() {
    return await apiClient.get(`/teams/get/all/teams/employee`);
  }

  // Employee CRUD Operations
  async getAllEmployees(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/employees?${queryString}` : "/employees";

    return await this.apiCall(endpoint);
  }

  async getEmployees() {
    const endpoint = "/employees";

    return await this.apiCall(endpoint);
  }

  async getEmployeeById(employeeId) {
    return await this.apiCall(`/employees/${employeeId}`);
  }

  async createEmployee(employeeData) {
    return await apiClient.post("/employees/comprehensive", employeeData);
  }

  async updateEmployee(employeeId, employeeData) {
    return await this.apiCall(`/employees/${employeeId}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(employeeId) {
    return await this.apiCall(`/employees/${employeeId}`, {
      method: "DELETE",
    });
  }

  async updateEmployeeStatus(employeeId, status) {
    return await this.apiCall(`/employees/${employeeId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Department Operations
  async getAllDepartments() {
    // 🚀 Return dummy data for now
    // return { data: departments };

    // 🔜 Later, just switch to:
    return await apiClient.get("/department");
  }

  async getDepartmentById(departmentId) {
    return await this.apiCall(`/departments/${departmentId}`);
  }

  async createDepartment(departmentData) {
    return await this.apiCall("/departments", {
      method: "POST",
      body: JSON.stringify(departmentData),
    });
  }

  async updateDepartment(departmentId, departmentData) {
    return await this.apiCall(`/departments/${departmentId}`, {
      method: "PUT",
      body: JSON.stringify(departmentData),
    });
  }

  // Document Operations
  async getEmployeeDocuments(employeeId) {
    return await this.apiCall(`/employees/${employeeId}/documents`);
  }

  async uploadEmployeeDocument(employeeId, formData) {
    return await this.apiCall(`/employees/${employeeId}/documents`, {
      method: "POST",
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : "",
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
  }

  async deleteEmployeeDocument(employeeId, documentId) {
    return await this.apiCall(
      `/employees/${employeeId}/documents/${documentId}`,
      {
        method: "DELETE",
      }
    );
  }

  // Performance Operations
  async getEmployeePerformance(employeeId) {
    return await this.apiCall(`/employees/${employeeId}/performance`);
  }

  async createPerformanceReview(performanceData) {
    return await this.apiCall("/performance-reviews", {
      method: "POST",
      body: JSON.stringify(performanceData),
    });
  }

  async updatePerformanceReview(reviewId, performanceData) {
    return await this.apiCall(`/performance-reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(performanceData),
    });
  }

  // Analytics Operations
  async getEmployeeAnalytics(timeRange = "30d") {
    return await this.apiCall(`/analytics/employees?range=${timeRange}`);
  }

  async getDepartmentAnalytics(departmentId, timeRange = "30d") {
    return await this.apiCall(
      `/analytics/departments/${departmentId}?range=${timeRange}`
    );
  }

  async getPerformanceAnalytics(timeRange = "30d") {
    return await this.apiCall(`/analytics/performance?range=${timeRange}`);
  }

  // Bulk Operations
  async bulkUpdateEmployees(updates) {
    return await this.apiCall("/employees/bulk-update", {
      method: "PATCH",
      body: JSON.stringify({ updates }),
    });
  }

  async exportEmployeeData(format = "csv", filters = {}) {
    const queryParams = new URLSearchParams();
    queryParams.append("format", format);

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(
      `${this.baseURL}/employees/export?${queryParams.toString()}`,
      {
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : "",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async importEmployeeData(formData) {
    return await this.apiCall("/employees/import", {
      method: "POST",
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : "",
      },
      body: formData,
    });
  }

  // Search Operations
  async searchEmployees(query, filters = {}) {
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    return await this.apiCall(`/employees/search?${queryParams.toString()}`);
  }

  // Utility Methods
  setAuthToken(token) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  clearAuthToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  // Lifecycle Operations
  async getOnboardingTasks(employeeId) {
    return await this.apiCall(`/employees/${employeeId}/onboarding`);
  }

  async updateOnboardingTask(employeeId, taskId, status) {
    return await this.apiCall(`/employees/${employeeId}/onboarding/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async initiateOffboarding(employeeId, offboardingData) {
    return await this.apiCall(`/employees/${employeeId}/offboarding`, {
      method: "POST",
      body: JSON.stringify(offboardingData),
    });
  }

  // Organization Chart Data
  async getOrganizationHierarchy() {
    return await this.apiCall("/organization/hierarchy");
  }

  async updateReportingStructure(employeeId, reportingData) {
    return await this.apiCall(`/employees/${employeeId}/reporting`, {
      method: "PUT",
      body: JSON.stringify(reportingData),
    });
  }
}

// Create singleton instance
export const employeeService = new EmployeeService();

// Export class for testing or custom instances
export default EmployeeService;
