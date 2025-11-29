import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE + "/admin",
  withCredentials: true,
});

// attach access token if present
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("adminAccessToken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
