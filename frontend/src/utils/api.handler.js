class ApiHandler {
  static async makeRequest(url, method, data = null, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        console.error(`Error: ${result.message || 'Unknown error occurred'}`);
        throw new Error(result.message || 'Something went wrong. Please try again later.');
      }

      return result;
    } catch (error) {
      console.error('API call error:', error.message);
      throw new Error(error.message || 'Network error. Please check your connection.');
    }
  }

  static async get(url, token = null) {
    return this.makeRequest(url, 'GET', null, token);
  }

  static async post(url, data, token = null) {
    return this.makeRequest(url, 'POST', data, token);
  }

  static async put(url, data, token = null) {
    return this.makeRequest(url, 'PUT', data, token);
  }

  static async delete(url, token = null) {
    return this.makeRequest(url, 'DELETE', null, token);
  }
}

export default ApiHandler;