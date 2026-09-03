// src/api/adminApi.js

import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_ADMIN_BASE ||
  "http://localhost:5000/api/admin";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// AUTH
// =====================================================

export const adminLoginApi = async (
  email,
  password
) => {
  const res = await API.post(
    "/login",
    {
      email,
      password,
    }
  );

  if (res.data?.accessToken) {
    localStorage.setItem(
      "adminToken",
      res.data.accessToken
    );

    localStorage.setItem(
      "role",
      "admin"
    );
  }

  return res.data;
};

export const refreshAdminToken = async () => {
  const res = await API.post(
    "/refresh"
  );

  if (res.data?.accessToken) {
    localStorage.setItem(
      "adminToken",
      res.data.accessToken
    );
  }

  return res.data;
};

export const adminLogoutApi = async () => {
  try {
    const res = await API.post(
      "/logout"
    );

    return res.data;
  } finally {
    localStorage.removeItem(
      "adminToken"
    );

    if (
      localStorage.getItem("role") ===
      "admin"
    ) {
      localStorage.removeItem("role");
    }
  }
};

// =====================================================
// ADMIN PROFILE
// =====================================================

export const getAdminProfile = async () => {
  const res = await API.get("/me");

  return res.data;
};

// =====================================================
// DASHBOARD
// =====================================================

export const getAdminStats = async () => {
  const res = await API.get(
    "/dashboard"
  );

  return res.data?.stats || res.data;
};

// =====================================================
// USERS
// =====================================================

export const getUsers = async (
  query = {}
) => {
  const res = await API.get(
    "/users",
    {
      params: query,
    }
  );

  return res.data;
};

// =====================================================
// SINGLE USER
// =====================================================

export const getUserById = async (
  id
) => {
  const res = await API.get(
    `/users/${id}`
  );

  return res.data;
};

// =====================================================
// MECHANICS
// =====================================================

export const getMechanics = async (
  query = {}
) => {
  const res = await API.get(
    "/mechanics",
    {
      params: query,
    }
  );

  return res.data;
};

// =====================================================
// SINGLE MECHANIC
// =====================================================

export const getMechanicById = async (
  id
) => {
  const res = await API.get(
    `/mechanics/${id}`
  );

  return res.data;
};

// =====================================================
// REQUESTS
// =====================================================

export const getRequests = async (
  query = {}
) => {
  const res = await API.get(
    "/requests",
    {
      params: query,
    }
  );

  return res.data;
};

// =====================================================
// SINGLE REQUEST
// =====================================================

export const getRequestById = async (
  id
) => {
  const res = await API.get(
    `/requests/${id}`
  );

  return res.data;
};

// =====================================================
// CANCELLATION HISTORY
// =====================================================

export const getCancellationHistory =
  async () => {
    const res = await API.get(
      "/cancellations"
    );

    return res.data;
  };

// =====================================================
// USER ACTIONS
// =====================================================

export const adminToggleUser = async (
  userId,
  action
) => {
  const res = await API.post(
    `/users/${userId}/${action}`
  );

  return res.data;
};

// =====================================================
// MECHANIC ACTIONS
// =====================================================

export const adminToggleMechanic =
  async (
    mechanicId,
    action
  ) => {
    const res = await API.post(
      `/mechanics/${mechanicId}/${action}`
    );

    return res.data;
  };

// =====================================================
// ASSIGN REQUEST
// =====================================================

export const adminAssignRequest =
  async (
    requestId,
    mechanicId
  ) => {
    const res = await API.post(
      `/requests/${requestId}/assign`,
      {
        mechanicId,
      }
    );

    return res.data;
  };

export default API;