// src/api/adminApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/admin"; // change if needed

const API = axios.create({
  baseURL: BASE_URL,
});

// add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const adminLoginApi = async (email, password) => {
  const res = await API.post("/login", { email, password });
  return res.data;
};

// Stats & lists
export const getAdminStats = async () => {
  const res = await API.get("/stats");
  return res.data;
};

export const getUsers = async (query = {}) => {
  const res = await API.get("/users", { params: query });
  return res.data;
};

export const getMechanics = async (query = {}) => {
  const res = await API.get("/mechanics", { params: query });
  return res.data;
};

export const getRequests = async (query = {}) => {
  const res = await API.get("/requests", { params: query });
  return res.data;
};

// Actions
export const adminToggleUser = async (userId, action) => {
  // action: 'block'|'unblock'|'delete'
  const res = await API.post(`/users/${userId}/${action}`);
  return res.data;
};

export const adminToggleMechanic = async (mechId, action) => {
  const res = await API.post(`/mechanics/${mechId}/${action}`);
  return res.data;
};

export const adminAssignRequest = async (requestId, mechanicId) => {
  const res = await API.post(`/requests/${requestId}/assign`, { mechanicId });
  return res.data;
};

// fallback export
export default API;
