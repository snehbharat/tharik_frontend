import axios from "axios";
import Cookies from "js-cookie";

class ClientService {
  constructor() {
    // Vite exposes env variables via import.meta.env
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    // if (!baseURL) {
    //   throw new Error("API base URL not set in .env file");
    // }

    this.api = axios.create({
      baseURL,
    });

    // Add interceptor to include token in every request
    this.api.interceptors.request.use((config) => {
      const token = Cookies.get("amoagc_token");
      if (!token) {
        window.location.href = "/login";
        return Promise.reject(new Error("Token not found in cookies"));
      }
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  // Get client count
  async getClientCount() {
    return this.api.get("/client/client-count");
  }

  // Get all clients with pagination
  async getAllClients(page = 1, limit = 10) {
    return this.api.get(`/client/getAll?page=${page}&limit=${limit}`);
  }

  // Create new client
  async createClient(payload) {
    return this.api.post("/client/create", payload);
  }

  // Update client by ID
  async updateClient(id, payload) {
    return this.api.put(`/client/${id}`, payload);
  }

  // Delete client by ID
  async deleteClient(id) {
    return this.api.delete(`/client/${id}`);
  }
}

export default new ClientService();
