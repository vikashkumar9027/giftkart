import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('giftnest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized occurs on protected call, clear invalid credentials
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking /api/auth/me during initial app boot
      const isAuthCheck = error.config.url.includes('/auth/me');
      if (!isAuthCheck) {
        // localStorage.removeItem('giftnest_token');
        // localStorage.removeItem('giftnest_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
