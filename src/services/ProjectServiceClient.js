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

  getProjectById(id) {
    return apiClient.get(`/project/me/${id}`);
  }

  deactivateProject(id) {
    return apiClient.patch(`/project/deactivate/${id}`);
  }
}

export default new ProjectServiceClient();