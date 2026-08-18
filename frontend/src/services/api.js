import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE ||
    "http://localhost:5000/api",

  withCredentials: true,
});

// Automatically attach logged-in user's token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired token
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const role = localStorage.getItem("role");

      if (role === "user") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/user/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;