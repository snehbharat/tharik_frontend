import { apiClient } from "./ApiClient";

class ClientService {
  getClientCount() {
    return apiClient.getCC("/client/client-count");
  }

  getAllClients(page = 1, limit = 10) {
    return apiClient.get("/client/getAll", { page, limit });
  }

  createClient(payload) {
    return apiClient.post("/client/create", payload);
  }

  updateClient(id, payload) {
    return apiClient.put(`/client/${id}`, payload);
  }

  deleteClient(id) {
    return apiClient.delete(`/client/${id}`);
  }

  exportClientDetails() {
    return apiClient.getExport("/client/export/client/details")
  }
}

export default new ClientService();
