import { apiClient } from "./ApiClient";

class ScheduleTaskService {
  getScheduleTaskCount() {
    return apiClient.getCC("/schedule/task-count");
  }

  getAllScheduleTasks(page = 1, limit = 10) {
    return apiClient.get("/schedule/getAll", { page, limit });
  }

  createScheduleTask(payload) {
    return apiClient.post("/schedule/create", payload);
  }

  updateScheduleTask(id, payload) {
    return apiClient.put(`/schedule/${id}`, payload);
  }

  deleteScheduleTask(id) {
    return apiClient.delete(`/schedule/${id}`);
  }

  exportScheduleTasks() {
    return apiClient.getExport("/schedule/export/tasks");
  }
}

export default new ScheduleTaskService();
