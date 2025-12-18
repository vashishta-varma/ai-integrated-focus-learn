import logger from '../utils/logger.js';

class ApiClient {
  constructor(baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestId = this.generateRequestId();
    
    // Log outgoing request
    logger.api(`Sending ${options.method || 'GET'} request to ${endpoint}`);

    const startTime = performance.now();
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          ...options.headers,
        },
        ...options,
      });

      const duration = Math.round(performance.now() - startTime);
      const statusText = response.ok ? 'SUCCESS' : 'FAILED';
      
      // Log response
      logger.api(`${statusText}: ${options.method || 'GET'} ${endpoint} → ${response.status} (${duration}ms)`);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      return response;
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      
      logger.error(`❌ API request failed: ${options.method || 'GET'} ${endpoint} - ${error.message} (${duration}ms)`);
      
      throw error;
    }
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default new ApiClient();