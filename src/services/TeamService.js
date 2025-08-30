import { apiClient } from "./ApiClient";

class TeamService {
  getAllTeams(page = 1, limit = 10) {
    return apiClient.get("/teams/getAll", { page, limit });
  }

  createTeam(payload) {
    return apiClient.post("/teams/create", payload);
  }

  updateTeam(id, payload) {
    return apiClient.put(`/teams/${id}`, payload);
  }

  deleteTeam(id) {
    return apiClient.delete(`/teams/${id}`);
  }
}

export default new TeamService();
