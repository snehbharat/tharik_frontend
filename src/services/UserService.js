import { apiClient } from "./ApiClient";

class UserService {
  getAllUsers() {
    return apiClient.get("/auth/user/all");
  }

  createUser(payload) {
    return apiClient.post("/auth/user/save", payload);
  }

  updateUser(id, payload) {
    return apiClient.put(`/auth/user/${id}`, payload);
  }

  deleteUser(id) {
    return apiClient.delete(`/auth/user/${id}`);
  }
}

export default new UserService();
