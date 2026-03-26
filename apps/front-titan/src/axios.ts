import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10101/api";

export const api = axios.create({
  baseURL: API_URL,
});

export const loggedApi = axios.create({
  baseURL: API_URL,
});

loggedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

loggedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
