import axios from "axios";
const api = axios.create({
  baseURL: "/", // vite proxy routes /api -> backend
});
api.interceptors.request.use(cfg=>{
  const token = localStorage.getItem("adminToken");
  if(token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export default api;
