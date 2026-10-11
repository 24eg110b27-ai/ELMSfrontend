import axios from "axios";
import { buildApiBaseUrl, isPublicAuthRequest } from "./apiConfig";

const normalizedBaseUrl = buildApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL || "/api"
);

const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (
      token &&
      !isPublicAuthRequest(config.url) &&
      !config.headers.Authorization
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !isPublicAuthRequest(error.config?.url)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;