import API from "../services/api";

export const sendContactMessageApi = async (data) => {
  const response = await API.post("/contact", data);
  return response.data;
};

// ================= USER AUTH =================

export const loginUser = async (email, password) => {
  const res = await API.post("/users/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  const token =
    res.data?.accessToken ||
    res.data?.token ||
    res.data?.access;

  if (token) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", "user");
  }

  return res.data;
};

// ================= PROFILE =================

export const getUserProfileApi = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const updateUserProfileApi = async (data) => {
  const res = await API.put("/users/me", data);
  return res.data;
};

// ================= REQUESTS =================

export const getActiveRequestApi = async () => {
  const res = await API.get("/users/requests/active");
  return res.data;
};

export const getHistoryApi = async () => {
  const res = await API.get("/users/requests/history");
  return res.data;
};

export const createRequestApi = async (data) => {
  const res = await API.post("/users/requests", data);
  return res.data;
};

export const cancelUserRequestApi = async (requestId) => {
  const res = await API.put(`/users/${requestId}/cancel`);
  return res.data;
};

// ================= NEARBY MECHANICS =================
export const getNearbyMechanicsApi = async ({
  lat,
  lng,
  radius = 50,
}) => {
  const response = await API.get("/users/mechanics/nearby", {
    params: {
      lat,
      lng,
      radius,
    },
  });

  return response.data;
};
// ================= NOTIFICATIONS =================

export const getNotificationsApi = async () => {
  const res = await API.get("/users/notifications");
  return res.data;
};

export const markNotificationReadApi = async (id) => {
  const res = await API.post(`/users/notifications/${id}/read`);
  return res.data;
};