import { apiClient } from "./ApiClient";
import { AUTH_CONFIG, API_CONFIG } from "../config/constants";
import axios from "axios";
import Cookies from "js-cookie";

// Fetch company data
export const getCompany = async () => {
  const res = await apiClient.get("/company/get");
  return res.data;
};

// Update company data
// export const updateCompany = async (companyData) => {
//   const res = await apiClient.put("/company/update", companyData);
//   return res.data;
// };

export const updateCompany = async (companyData, imageFile) => {
  try {
    const token = Cookies.get("amoagc_token");
    const formData = new FormData();

    console.log("=== FRONTEND: Preparing FormData ===");
    console.log("Image file to upload:", imageFile);
    console.log("Image file type:", imageFile?.type);
    console.log("Image file size:", imageFile?.size);
    console.log("Has image:", !!imageFile);

    // Fields that should NOT be sent to the backend
    const excludeFields = ['_id', 'id', 'createdAt', 'updatedAt', 'companyImage', '__v'];

    // Create a copy and remove unwanted fields
    const dataToSend = { ...companyData };
    excludeFields.forEach(field => delete dataToSend[field]);

    // Append all company data fields
    Object.keys(dataToSend).forEach((key) => {
      if (dataToSend[key] !== null && dataToSend[key] !== undefined) {
        formData.append(key, dataToSend[key]);
      }
    });

    // Append image if provided - THIS IS THE CRITICAL PART
    if (imageFile && imageFile instanceof File) {
      formData.append("companyImage", imageFile, imageFile.name);
      console.log("✓ Image file added to FormData");
      console.log("  - Name:", imageFile.name);
      console.log("  - Type:", imageFile.type);
      console.log("  - Size:", imageFile.size, "bytes");
    } else {
      console.log("✗ No valid image file to upload");
    }

    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`  ${pair[0]}: [File] ${pair[1].name}`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }
    console.log("================================");

    const config = {
      headers: {
        // DON'T manually set Content-Type - let browser set it with boundary
        // "Content-Type": "multipart/form-data", // REMOVE THIS
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.put(
      `${API_CONFIG.BASE_URL}/company/update`,
      formData,
      config
    );

    return response.data.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const deleteCompanyImage = async () => {
  try {
    const token = Cookies.get("amoagc_token");
    const config = {};

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await axios.delete(`${API_CONFIG.BASE_URL}/company/image`, config);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting company image:", error);
    throw error;
  }
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${API_CONFIG.BASE_URL.replace("/api", "")}${imagePath}`;
};
