import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/mechanics",
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const tok = localStorage.getItem("accessToken");
  if (tok) req.headers.Authorization = `Bearer ${tok}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response && err.response.status === 401 && !err.config.__isRetry) {
      err.config.__isRetry = true;
      try {
        const refresh = await API.get("/refresh");
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

// FIXED
export const sendOtp = ({ phone, purpose = 'signup' }) =>
  API.post('/send-otp', { phone, purpose });

export const registerMechanic = (data) => API.post('/register', data);

export const loginMechanic = async (data) => {
  const res = await API.post('/login', data);
  localStorage.setItem('accessToken', res.data.accessToken);
  return res.data;
};

export const requestPasswordReset = (phone) =>
  API.post('/send-otp', { phone, purpose: 'reset' });

export const resetPassword = (payload) =>
  API.post('/reset-password', payload);
