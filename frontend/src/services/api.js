import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE ||
    "http://localhost:5000/api",

  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (
  error,
  token = null
) => {
  failedQueue.forEach(
    (promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    }
  );

  failedQueue = [];
};

// =====================================================
// REQUEST
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

// =====================================================
// RESPONSE / AUTO REFRESH
// =====================================================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config;

    const status =
      error.response?.status;

    const url =
      originalRequest?.url || "";

    const role =
      localStorage.getItem("role");

    // Don't refresh refresh/login requests
    if (
      status !== 401 ||
      originalRequest?._retry ||
      url.includes("/users/refresh") ||
      url.includes("/users/login")
    ) {
      return Promise.reject(error);
    }

    // Only user requests use this API
    if (role !== "user") {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Another request is already refreshing
    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }
      ).then((newToken) => {
        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return API(
          originalRequest
        );
      });
    }

    isRefreshing = true;

    try {
      const response =
        await API.post(
          "/users/refresh"
        );

      const newToken =
        response.data?.accessToken;

      if (!newToken) {
        throw new Error(
          "No access token received"
        );
      }

      localStorage.setItem(
        "token",
        newToken
      );

      processQueue(
        null,
        newToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      return API(
        originalRequest
      );
    } catch (refreshError) {
      processQueue(
        refreshError,
        null
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "role"
      );

      window.location.href =
        "/user/login";

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;