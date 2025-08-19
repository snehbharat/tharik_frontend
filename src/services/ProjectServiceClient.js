import { apiClient } from "./ApiClient";

class ProjectServiceClient {
  getProjectCount() {
    return apiClient.get("/project/project-count");
  }

  getAllProjects(page = 1, limit = 10) {
    return apiClient.get("/project/all", { page, limit });
  }

  searchProjects(query) {
    return apiClient.get("/project/search", { query });
  }

  createProject(payload) {
    return apiClient.post("/project/create", payload);
  }

  updateProject(id, payload) {
    return apiClient.put(`/project/update/${id}`, payload);
  }

  deactivateProject(id) {
    return apiClient.delete(`/project/deactive/${id}`);
  }
}

export default new ProjectServiceClient();