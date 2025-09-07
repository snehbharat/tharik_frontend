import { apiClient } from "./ApiClient";

class UserService {
  getAllLeaves() {
    return apiClient.get("/leaves");
  }

  createLeave(payload) {
    return apiClient.post("/leaves", payload);
  }

  updateLeave(id, payload) {
    return apiClient.put(`/leaves/${id}`, payload);
  }

  deleteLeave(id) {
    return apiClient.delete(`/leaves/${id}`);
  }
}

export default new UserService();
