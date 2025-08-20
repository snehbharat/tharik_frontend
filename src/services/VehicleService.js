import { apiClient } from "./ApiClient";

class VehicleService {
  // Get vehicles with pagination
  getAllVehicles(page = 1, limit = 10) {
    return apiClient.get("/vehicle/getAll", { page, limit });
  }

  // Create new vehicle
  createVehicle(payload) {
    return apiClient.post("/vehicle/create", payload);
  }

  // Update existing vehicle
  updateVehicle(id, payload) {
    return apiClient.put(`/vehicle/me/${id}`, payload);
  }

  // Delete vehicle
  deleteVehicle(id) {
    return apiClient.delete(`/vehicle/me/${id}`);
  }

  // Search vehicles
  searchVehicles(query) {
    return apiClient.get("/vehicle/search", { query });
  }

  // Upload vehicles from Excel
  uploadVehiclesFromExcel(file) {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post("/vehicle/upload/excel", formData);
  }

  // Get vehicle count/details (similar to client count)
  getVehicleCountDetails() {
    return apiClient.get("/vehicle/vehicle-count");
  }
}

export default new VehicleService();
