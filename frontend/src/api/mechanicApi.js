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
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "accessToken"
      ) ||
      localStorage.getItem(
        "token"
      );

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

    if (
      status !== 401 ||
      originalRequest?._retry ||
      url.includes("/mechanics/refresh") ||
      url.includes("/mechanics/login")
    ) {
      return Promise.reject(error);
    }

    if (role !== "mechanic") {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

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
          "/mechanics/refresh"
        );

      const newToken =
        response.data?.accessToken;

      if (!newToken) {
        throw new Error(
          "No access token received"
        );
      }

      localStorage.setItem(
        "accessToken",
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
        "accessToken"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "role"
      );

      window.location.href =
        "/mechanic/login";

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

// =====================================================
// OTP
// =====================================================

export const sendOtp = ({
  email,
  phone,
  purpose = "signup",
}) =>
  API.post("/otp/send", {
    email,
    phone,
    purpose,
  });

// =====================================================
// AUTH
// =====================================================

export const registerMechanic = (
  payload
) =>
  API.post(
    "/mechanics/register",
    payload
  );

export const loginMechanic = async (
  data
) => {
  const res =
    await API.post(
      "/mechanics/login",
      data
    );

  const token =
    res.data?.accessToken ||
    res.data?.token ||
    res.data?.access;

  if (token) {
    localStorage.setItem(
      "accessToken",
      token
    );

    localStorage.setItem(
      "role",
      "mechanic"
    );
  }

  return res;
};

export const logout = async () => {
  try {
    await API.post(
      "/mechanics/logout"
    );
  } finally {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );
  }
};

// =====================================================
// PROFILE
// =====================================================

export const getMechanicProfile =
  () =>
    API.get("/mechanics/me");

// =====================================================
// LOCATION
// =====================================================

export const updateGarageLocation = (
  coordinates
) =>
  API.put(
    "/mechanics/location/garage",
    {
      coordinates,
    }
  );

export const updateCurrentLocation = (
  coordinates
) =>
  API.put(
    "/mechanics/location/current",
    {
      coordinates,
    }
  );

// =====================================================
// AVAILABILITY
// =====================================================

export const updateMechanicAvailability =
  (isOnline) =>
    API.put(
      "/mechanics/availability",
      {
        isOnline,
      }
    );


// =====================================================
// MECHANIC PASSWORD RESET
// =====================================================

export const sendMechanicResetOtp = (email) =>
  API.post(
    "/mechanics/password/send-otp",
    {
      email: email.trim().toLowerCase(),
    }
  );


export const verifyMechanicResetOtp = (
  email,
  otp
) =>
  API.post(
    "/mechanics/password/verify-otp",
    {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
    }
  );


export const resetMechanicPassword = (
  email,
  otp,
  password
) =>
  API.post(
    "/mechanics/password/reset-password",
    {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      password,
    }
  );


// =====================================================
// REQUESTS
// =====================================================

export const getMechanicRequests =
  () =>
    API.get(
      "/mechanics/requests"
    );

export const acceptMechanicRequest =
  (id) =>
    API.put(
      `/mechanics/requests/${id}/accept`
    );

export const updateMechanicRequestStatus =
  (id, status) =>
    API.put(
      `/mechanics/requests/${id}/status`,
      {
        status,
      }
    );

export default API;