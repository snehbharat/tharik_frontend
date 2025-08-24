import { apiClient } from "./ApiClient";

// Fetch company data
export const getCompany = async () => {
  const res = await apiClient.get("/company/get");
  return res.data;
};

// Update company data
export const updateCompany = async (companyData) => {
  const res = await apiClient.put("/company/update", companyData);
  return res.data;
};
