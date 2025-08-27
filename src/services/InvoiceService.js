import { apiClient } from "./ApiClient";

class InvoiceService {
  // Create new invoice
  createInvoice(payload) {
    return apiClient.post("/invoice/create", payload);
  }

  // Get all invoices with pagination
  getAllInvoices(page = 1, limit = 10) {
    return apiClient.get("/invoice/getAll", { page, limit });
  }

  // Get invoice by ID
  getInvoiceById(id) {
    return apiClient.get(`/invoice/${id}`);
  }

  // Update invoice
  updateInvoice(id, payload) {
    return apiClient.put(`/invoice/${id}`, payload);
  }

  // Delete invoice
  deleteInvoice(id) {
    return apiClient.delete(`/invoice/${id}`);
  }

  // Search invoices (example: by status, client, date range, etc.)
  searchInvoices(query) {
    return apiClient.get("/invoice/search", query);
  }

  // Get invoice stats (like counts, totals, etc.)
  getInvoiceStats() {
    return apiClient.get("/invoice/stats");
  }

  // Export invoice details (CSV/Excel)
  exportInvoiceDetails() {
    return apiClient.getExport("/invoice/export/details");
  }
}

export default new InvoiceService();
