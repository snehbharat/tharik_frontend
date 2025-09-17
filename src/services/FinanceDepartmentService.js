import { apiClient } from "./ApiClient";

class FinanceDepartmentService {
  getFinanceSummary() {
    return apiClient.get("/finance/summary");
  }
}

export default new FinanceDepartmentService();
