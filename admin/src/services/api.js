import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE ||
    "http://localhost:5000/api",

  withCredentials: true,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminAccessToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// TOKEN REFRESH CONTROL
// =====================================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const url = originalRequest.url || "";

    // Don't refresh login / refresh request
    if (
      status !== 401 ||
      originalRequest._retry ||
      url.includes("/admin/login") ||
      url.includes("/admin/refresh")
    ) {
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

        return API(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const response = await API.post(
        "/admin/refresh"
      );

      const newToken =
        response.data?.accessToken ||
        response.data?.token;

      if (!newToken) {
        throw new Error(
          "No access token received"
        );
      }

      localStorage.setItem(
        "adminAccessToken",
        newToken
      );

      processQueue(
        null,
        newToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      return API(originalRequest);
    } catch (refreshError) {
      processQueue(
        refreshError,
        null
      );

      localStorage.removeItem(
        "adminAccessToken"
      );

      localStorage.removeItem(
        "admin"
      );

      window.location.href =
        "/login";

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

// =====================================================
// ADMIN AUTH
// =====================================================

export const adminLogin = async (
  email,
  password
) => {
  const res = await API.post(
    "/admin/login",
    {
      email: email
        .trim()
        .toLowerCase(),
      password,
    }
  );

  const token =
    res.data?.accessToken ||
    res.data?.token;

  if (!token) {
    throw new Error(
      "Access token missing from login response"
    );
  }

  localStorage.setItem(
    "adminAccessToken",
    token
  );

  localStorage.setItem(
    "admin",
    JSON.stringify(
      res.data?.admin || {}
    )
  );

  return res.data;
};

export const adminLogout = async () => {
  try {
    await API.post(
      "/admin/logout"
    );
  } finally {
    localStorage.removeItem(
      "adminAccessToken"
    );

    localStorage.removeItem(
      "admin"
    );
  }
};

// =====================================================
// ADMIN PROFILE
// =====================================================

export const getAdminProfile = async () => {
  const res = await API.get(
    "/admin/me"
  );

  return res.data;
};

// =====================================================
// DASHBOARD
// =====================================================

export const getDashboardStats =
  async () => {
    const res = await API.get(
      "/admin/dashboard"
    );

    return res.data;
  };

// =====================================================
// USERS
// =====================================================

export const getAdminUsers = async () => {
  const res = await API.get(
    "/admin/users"
  );

  return res.data;
};

export const getAdminUserById =
  async (id) => {
    const res = await API.get(
      `/admin/users/${id}`
    );

    return res.data;
  };

// =====================================================
// MECHANICS
// =====================================================

export const getAdminMechanics =
  async () => {
    const res = await API.get(
      "/admin/mechanics"
    );

    return res.data;
  };

export const getAdminMechanicById =
  async (id) => {
    const res = await API.get(
      `/admin/mechanics/${id}`
    );

    return res.data;
  };

// =====================================================
// REQUESTS
// =====================================================

export const getAdminRequests =
  async () => {
    const res = await API.get(
      "/admin/requests"
    );

    return res.data;
  };

export const getAdminRequestById =
  async (id) => {
    const res = await API.get(
      `/admin/requests/${id}`
    );

    return res.data;
  };

export default API;