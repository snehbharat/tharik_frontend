// HourlyManagementAPI.js - Frontend API service for hourly rate management

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://31.97.203.245:3001/api';

class HourlyManagementAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/hourly-rates`;
  }

  // Helper method for API requests
  async apiRequest(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Hourly Rate CRUD Operations

  /**
   * Create a new hourly rate
   * @param {Object} hourlyRateData - The hourly rate data
   * @returns {Promise<Object>} Created hourly rate
   */
  async createHourlyRate(hourlyRateData) {
    return await this.apiRequest(this.baseURL, {
      method: 'POST',
      body: JSON.stringify({
        ...hourlyRateData,
        created_by: this.getCurrentUser(),
      }),
    });
  }

  /**
   * Get all hourly rates with pagination and filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Hourly rates with pagination info
   */
  async getAllHourlyRates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${this.baseURL}?${queryString}` : this.baseURL;
    return await this.apiRequest(url);
  }

  /**
   * Get hourly rate by ID
   * @param {string} id - Hourly rate ID
   * @returns {Promise<Object>} Hourly rate details
   */
  async getHourlyRateById(id) {
    return await this.apiRequest(`${this.baseURL}/${id}`);
  }

  /**
   * Update hourly rate
   * @param {string} id - Hourly rate ID
   * @param {Object} updateData - Updated hourly rate data
   * @returns {Promise<Object>} Updated hourly rate
   */
  async updateHourlyRate(id, updateData) {
    return await this.apiRequest(`${this.baseURL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...updateData,
        updated_by: this.getCurrentUser(),
      }),
    });
  }

  /**
   * Delete hourly rate
   * @param {string} id - Hourly rate ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteHourlyRate(id) {
    return await this.apiRequest(`${this.baseURL}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Approve hourly rate
   * @param {string} id - Hourly rate ID
   * @returns {Promise<Object>} Approved hourly rate
   */
  async approveHourlyRate(id) {
    return await this.apiRequest(`${this.baseURL}/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({
        approved_by: this.getCurrentUser(),
      }),
    });
  }

  /**
   * Bulk approve hourly rates
   * @param {Array<string>} ids - Array of hourly rate IDs
   * @returns {Promise<Object>} Bulk approval result
   */
  async bulkApproveRates(ids) {
    return await this.apiRequest(`${this.baseURL}/bulk-approve`, {
      method: 'POST',
      body: JSON.stringify({
        ids,
        approved_by: this.getCurrentUser(),
      }),
    });
  }

  // Employee-specific operations

  /**
   * Get hourly rates for a specific employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise<Array>} Employee's hourly rates
   */
  async getEmployeeHourlyRates(employeeId) {
    return await this.apiRequest(`${this.baseURL}/employee/${employeeId}`);
  }

  /**
   * Get active hourly rate for an employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise<Object>} Active hourly rate
   */
  async getEmployeeActiveRate(employeeId) {
    return await this.apiRequest(`${this.baseURL}/employee/${employeeId}/active`);
  }

  /**
   * Get employee rate history
   * @param {string} employeeId - Employee ID
   * @returns {Promise<Array>} Employee's rate history
   */
  async getEmployeeRateHistory(employeeId) {
    return await this.apiRequest(`${this.baseURL}/employee/${employeeId}/history`);
  }

  // Calculation and statistics

  /**
   * Calculate monthly equivalent salary
   * @param {Object} calculationData - Calculation parameters
   * @returns {Promise<Object>} Monthly equivalent calculation
   */
  async calculateMonthlyEquivalent(calculationData) {
    return await this.apiRequest(`${this.baseURL}/calculate`, {
      method: 'POST',
      body: JSON.stringify(calculationData),
    });
  }

  /**
   * Get hourly rate statistics
   * @returns {Promise<Object>} Statistics data
   */
  async getStatistics() {
    return await this.apiRequest(`${this.baseURL}/statistics`);
  }

  /**
   * Get upcoming rate changes
   * @param {number} days - Number of days to look ahead (default: 30)
   * @returns {Promise<Array>} Upcoming rate changes
   */
  async getUpcomingRateChanges(days = 30) {
    return await this.apiRequest(`${this.baseURL}/upcoming-changes?days=${days}`);
  }

  // Configuration operations

  /**
   * Get standard hours configuration
   * @returns {Promise<Object>} Standard hours configuration
   */
  async getStandardHoursConfig() {
    return await this.apiRequest(`${this.baseURL}/config/standard-hours`);
  }

  /**
   * Update standard hours configuration
   * @param {Object} configData - Configuration data
   * @returns {Promise<Object>} Updated configuration
   */
  async updateStandardHoursConfig(configData) {
    return await this.apiRequest(`${this.baseURL}/config/standard-hours`, {
      method: 'PUT',
      body: JSON.stringify({
        ...configData,
        last_modified_by: this.getCurrentUser(),
      }),
    });
  }

  /**
   * Get overtime multipliers
   * @returns {Promise<Array>} Overtime multipliers
   */
  async getOvertimeMultipliers() {
    return await this.apiRequest(`${this.baseURL}/config/overtime-multipliers`);
  }

  // Search and filtering operations

  /**
   * Search hourly rates
   * @param {string} searchTerm - Search term
   * @param {Object} params - Additional search parameters
   * @returns {Promise<Object>} Search results with pagination
   */
  async searchHourlyRates(searchTerm, params = {}) {
    const searchParams = {
      search: searchTerm,
      ...params,
    };
    return await this.getAllHourlyRates(searchParams);
  }

  /**
   * Get hourly rates by status
   * @param {string} status - Rate status (active, draft, expired, suspended)
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Filtered hourly rates
   */
  async getHourlyRatesByStatus(status, params = {}) {
    return await this.getAllHourlyRates({ status, ...params });
  }

  /**
   * Get hourly rates by date range
   * @param {string} startDate - Start date (ISO string)
   * @param {string} endDate - End date (ISO string)
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Filtered hourly rates
   */
  async getHourlyRatesByDateRange(startDate, endDate, params = {}) {
    return await this.getAllHourlyRates({
      start_date: startDate,
      end_date: endDate,
      ...params,
    });
  }

  // Validation operations

  /**
   * Validate hourly wage
   * @param {number} wage - Hourly wage amount
   * @returns {Object} Validation result
   */
  validateHourlyWage(wage) {
    const errors = [];
    const numWage = parseFloat(wage);

    if (isNaN(numWage)) {
      errors.push('Wage must be a valid number');
    } else {
      if (numWage < 18.0) {
        errors.push('Wage below Saudi minimum wage (18.00 SAR)');
      }
      if (numWage > 500.0) {
        errors.push('Wage exceeds maximum limit (500.00 SAR)');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format SAR currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatSAR(amount) {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Calculate monthly equivalent locally (for preview purposes)
   * @param {number} hourlyRate - Hourly rate
   * @param {number} standardHours - Standard hours per month
   * @param {number} overtimeHours - Overtime hours
   * @param {number} overtimeMultiplier - Overtime multiplier
   * @returns {Object} Calculation result
   */
  calculateMonthlyEquivalentLocal(
    hourlyRate,
    standardHours,
    overtimeHours = 0,
    overtimeMultiplier = 1.5
  ) {
    const regularPay = hourlyRate * standardHours;
    const overtimePay = hourlyRate * overtimeHours * overtimeMultiplier;
    const totalMonthlyEquivalent = regularPay + overtimePay;
    const totalHours = standardHours + overtimeHours;
    const effectiveHourlyRate = totalHours > 0 ? totalMonthlyEquivalent / totalHours : 0;

    return {
      regularHours: standardHours,
      overtimeHours,
      regularPay: Number(regularPay.toFixed(2)),
      overtimePay: Number(overtimePay.toFixed(2)),
      totalMonthlyEquivalent: Number(totalMonthlyEquivalent.toFixed(2)),
      effectiveHourlyRate: Number(effectiveHourlyRate.toFixed(2)),
    };
  }

  // Utility methods

  /**
   * Get current user (mock implementation - should integrate with your auth system)
   * @returns {string} Current user identifier
   */
  getCurrentUser() {
    // This should be replaced with actual user identification logic
    return localStorage.getItem('currentUser') || 'system';
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   */
  handleError(error, context = 'API operation') {
    console.error(`${context} failed:`, error);
    
    // You can add toast notifications or other error handling here
    if (window.showToast) {
      window.showToast('error', `${context} failed: ${error.message}`);
    }
    
    throw error;
  }

  /**
   * Get employee list for dropdowns (requires employee API integration)
   * @returns {Promise<Array>} Employee options for dropdowns
   */
  async getEmployeesForDropdown() {
    try {
      const response = await this.apiRequest(`${API_BASE_URL}/employees/for-task`);
      return response.data || [];
    } catch (error) {
      console.warn('Failed to fetch employees for dropdown:', error);
      return [];
    }
  }

  // Cache management for better performance

  /**
   * Cache configuration data
   */
  _configCache = {
    standardHours: null,
    overtimeMultipliers: null,
    lastUpdated: null,
  };

  /**
   * Get cached standard hours config
   * @param {boolean} forceRefresh - Force refresh from server
   * @returns {Promise<Object>} Standard hours configuration
   */
  async getCachedStandardHoursConfig(forceRefresh = false) {
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();
    
    if (
      !forceRefresh &&
      this._configCache.standardHours &&
      this._configCache.lastUpdated &&
      (now - this._configCache.lastUpdated) < cacheExpiry
    ) {
      return { data: this._configCache.standardHours };
    }

    const response = await this.getStandardHoursConfig();
    this._configCache.standardHours = response.data;
    this._configCache.lastUpdated = now;
    
    return response;
  }

  /**
   * Get cached overtime multipliers
   * @param {boolean} forceRefresh - Force refresh from server
   * @returns {Promise<Array>} Overtime multipliers
   */
  async getCachedOvertimeMultipliers(forceRefresh = false) {
    const cacheExpiry = 10 * 60 * 1000; // 10 minutes
    const now = Date.now();
    
    if (
      !forceRefresh &&
      this._configCache.overtimeMultipliers &&
      this._configCache.lastUpdated &&
      (now - this._configCache.lastUpdated) < cacheExpiry
    ) {
      return { data: this._configCache.overtimeMultipliers };
    }

    const response = await this.getOvertimeMultipliers();
    this._configCache.overtimeMultipliers = response.data;
    this._configCache.lastUpdated = now;
    
    return response;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this._configCache = {
      standardHours: null,
      overtimeMultipliers: null,
      lastUpdated: null,
    };
  }
}

// Create and export a singleton instance
const hourlyManagementAPI = new HourlyManagementAPI();

export default hourlyManagementAPI;