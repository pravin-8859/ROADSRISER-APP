import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getContactMessagesApi = async () => {
  const res = await API.get("/contact");
  return res.data;
};

export const updateContactMessageStatusApi = async (id, status) => {
  const res = await API.put(`/contact/${id}/status`, {
    status,
  });

  return res.data;
};