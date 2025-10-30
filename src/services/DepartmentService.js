import { apiClient } from "./ApiClient";

class ClientService {
  getAllDepartment() {
    return apiClient.get("/department");
  }

  createDepartment(payload) {
    return apiClient.post("/department", payload);
  }

  updateDepartment(id, payload) {
    return apiClient.put(`/department/${id}`, payload);
  }

  deleteDepartment(id) {
    return apiClient.patch(`/department/${id}/deactivate`);
  }
}

export default new ClientService();
