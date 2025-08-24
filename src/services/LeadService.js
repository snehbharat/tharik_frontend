import { apiClient } from "./ApiClient";

class LeadService {
  getLeadCount() {
    return apiClient.getCC("/lead/lead-count");
  }

  getAllLeads(page = 1, limit = 10) {
    return apiClient.get("/lead/getAll", { page, limit });
  }

  createLead(payload) {
    return apiClient.post("/lead/create", payload);
  }

  updateLead(id, payload) {
    return apiClient.put(`/lead/${id}`, payload);
  }

  deleteLead(id) {
    return apiClient.delete(`/lead/${id}`);
  }

  exportLeadDetails() {
    return apiClient.getExport("/lead/export/lead/details");
  }
}

export default new LeadService();
