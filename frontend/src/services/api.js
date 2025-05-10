import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip redirect for /auth/me to allow checkAuth to handle 401 gracefully
    if (
      error.response?.status === 401 &&
      error.config.url !== '/auth/me'
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;