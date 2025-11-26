import axios from "axios";

// ------------------------------------
// AXIOS INSTANCE (Automatically adds token)
// ------------------------------------
const API = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------------------
// USER AUTH APIs
// ------------------------------------

// Login user
export const loginUser = async (email, password) => {
  const res = await API.post("/login", { email, password });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", "user");
  return res.data;
};

// Register user
export const registerUser = async (name, email, password, phone) => {
  const res = await API.post("/register", { name, email, password, phone });
  return res.data;
};

// ------------------------------------
// DASHBOARD APIs
// ------------------------------------

// Fetch active roadside request
export const getActiveRequestApi = async () => {
  const res = await API.get("/requests/active");
  return res.data;
};

// Fetch service history
export const getHistoryApi = async () => {
  const res = await API.get("/requests/history");
  return res.data;
};

// Fetch notifications
export const getNotificationsApi = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

// Create a new roadside request
export const createRequestApi = async (payload) => {
  const res = await API.post("/requests", payload);
  return res.data;
};

// Cancel a request (optional future use)
export const cancelRequestApi = async (requestId) => {
  const res = await API.delete(`/requests/${requestId}`);
  return res.data;
};

// Fetch profile
export const getProfileApi = async () => {
  const res = await API.get("/me");
  return res.data;
};

// Update profile
export const updateProfileApi = async (data) => {
  const res = await API.put("/me", data);
  return res.data;
};
