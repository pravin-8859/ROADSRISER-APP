// src/api/mechanicApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // root api
  withCredentials: true,
});

// attach access token if present (key: accessToken)
API.interceptors.request.use((req) => {
  const tok = localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (tok) req.headers.Authorization = `Bearer ${tok}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    // simple refresh handling if needed (optional)
    if (err.response && err.response.status === 401 && !err.config.__isRetry) {
      err.config.__isRetry = true;
      try {
        const refresh = await API.get("/mechanics/refresh");
        localStorage.setItem("accessToken", refresh.data.accessToken);
        err.config.headers.Authorization = `Bearer ${refresh.data.accessToken}`;
        return API(err.config);
      } catch (e) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

// OTP - call otp route
export const sendOtp = ({ email, phone, purpose = "signup" }) =>
  API.post("/otp/send", { email, phone, purpose });

// Register/login under mechanics
export const registerMechanic = (payload) => API.post("/mechanics/register", payload);
export const loginMechanic = async (data) => {
  const res = await API.post("/mechanics/login", data);
  // backend may return token in res.data.token or res.data.accessToken — handle both
  const tok = res.data.token || res.data.accessToken || res.data.access;
  if (tok) localStorage.setItem("accessToken", tok);
  return res;
};
export const refresh = () => API.get("/mechanics/refresh");
export const logout = () => API.post("/mechanics/logout");
