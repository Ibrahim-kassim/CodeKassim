import Api from './api.service';

// Initialize the API service with the base URL from environment variables
const api = Api.init({
  config: {
    baseURL: import.meta.env.VITE_BACK_END_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  },
  interceptors: {
    response: {
      onFulfilled: (response) => response,
      onRejected: (error) => Promise.reject(error)
    }
  }
});

export default api;
