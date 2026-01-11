// Axios client configuration for Django REST API
import axios from "axios";

// Configure base URL for Django backend (update when Django is running)
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://event-local-discovery.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token to headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const baseURL = import.meta.env.VITE_API_BASE_URL || "https://event-local-discovery.onrender.com";
          const response = await axios.post(`${baseURL}/auth/jwt/refresh/`, {
            refresh: refreshToken,
          });

          localStorage.setItem("access_token", response.data.access);
          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;

          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
