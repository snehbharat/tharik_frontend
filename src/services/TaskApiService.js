import { apiClient } from './ApiClient.js'

class ApiService {
  // Task Management APIs
  static async createTask(taskData, createdBy) {
    try {
      const response = await apiClient.post(`/task/tasks/${createdBy}`, taskData);
      return response;
    } catch (error) {
      console.error(`API Error (createTask):`, error);
      throw error;
    }
  }

  static async getTasksAllEmployee() {
    try {
      const response = await apiClient.get('/employees/task/all/employee');
      return response;
    } catch (error) {
      console.error(`API Error (getTasks):`, error);
      throw error;
    }
  }

  static async getTasks(filters = {}, options = {}) {
    try {
      const params = { ...filters, ...options };
      const response = await apiClient.get('/task/tasks', params);
      return response;
    } catch (error) {
      console.error(`API Error (getTasks):`, error);
      throw error;
    }
  }

  static async getTaskById(taskId) {
    try {
      const response = await apiClient.get(`/task/tasks/${taskId}`);
      return response;
    } catch (error) {
      console.error(`API Error (getTaskById):`, error);
      throw error;
    }
  }

  static async updateTask(taskId, updates) {
    try {
      const response = await apiClient.put(`/task/tasks/${taskId}`, updates);
      return response;
    } catch (error) {
      console.error(`API Error (updateTask):`, error);
      throw error;
    }
  }

  static async addTaskUpdate(taskId, updateData) {
    try {
      const response = await apiClient.post(`/task/tasks/${taskId}/updates`, updateData);
      return response;
    } catch (error) {
      console.error(`API Error (addTaskUpdate):`, error);
      throw error;
    }
  }

  static async addPhotoUpdate(taskId, photos) {
    try {
      const response = await apiClient.post(`/task/tasks/${taskId}/photos`, { photos });
      return response;
    } catch (error) {
      console.error(`API Error (addPhotoUpdate):`, error);
      throw error;
    }
  }

  // File upload methods - these might need special handling for FormData
  static async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // For file uploads, we might need to use axios directly from apiClient
      // since it handles FormData better than our standard post method
      const response = await apiClient.client.post('/task/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`API Error (uploadFile):`, error);
      throw error;
    }
  }

  // Bulk upload files
  static async uploadFiles(files) {
    try {
      const uploadPromises = Array.from(files).map(file => this.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error(`API Error (uploadFiles):`, error);
      throw error;
    }
  }

  // Alternative file upload method using your apiClient's post method
  // (if your backend can handle JSON with base64 encoded files)
  static async uploadFileAsBase64(file) {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Data = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
            const response = await apiClient.post('/task/upload', {
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              fileData: base64Data,
            });
            resolve(response);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error(`API Error (uploadFileAsBase64):`, error);
      throw error;
    }
  }

  // Utility methods to leverage your apiClient's features
  static isBackendConnected() {
    return apiClient.isBackendConnected();
  }

  static isMockMode() {
    return apiClient.isMockMode();
  }

  // Generic methods that directly expose your apiClient's functionality
  static async get(endpoint, params) {
    try {
      return await apiClient.get(endpoint, params);
    } catch (error) {
      console.error(`API Error (GET ${endpoint}):`, error);
      throw error;
    }
  }

  static async post(endpoint, data) {
    try {
      return await apiClient.post(endpoint, data);
    } catch (error) {
      console.error(`API Error (POST ${endpoint}):`, error);
      throw error;
    }
  }

  static async put(endpoint, data) {
    try {
      return await apiClient.put(endpoint, data);
    } catch (error) {
      console.error(`API Error (PUT ${endpoint}):`, error);
      throw error;
    }
  }

  static async delete(endpoint) {
    try {
      return await apiClient.delete(endpoint);
    } catch (error) {
      console.error(`API Error (DELETE ${endpoint}):`, error);
      throw error;
    }
  }

  static async patch(endpoint) {
    try {
      return await apiClient.patch(endpoint);
    } catch (error) {
      console.error(`API Error (PATCH ${endpoint}):`, error);
      throw error;
    }
  }

  // Export methods for files (leveraging your apiClient's getExport method)
  static async exportTasks(filters = {}) {
    try {
      const response = await apiClient.getExport('/tasks/export', filters);
      return response;
    } catch (error) {
      console.error(`API Error (exportTasks):`, error);
      throw error;
    }
  }
}

export default ApiService;