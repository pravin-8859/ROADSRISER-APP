import API from "../services/api";

// ================= USER AUTH =================

export const loginUser = async (email, password) => {
  const res = await API.post("/users/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", "user");

  return res.data;
};

export const registerUser = async (
  name,
  email,
  password,
  phone
) => {
  const res = await API.post("/users/register", {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone: phone?.trim() || undefined,
  });

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

// ================= NOTIFICATIONS =================

export const getNotificationsApi = async () => {
  const res = await API.get("/users/notifications");
  return res.data;
};

export const markNotificationReadApi = async (id) => {
  const res = await API.post(
    `/users/notifications/${id}/read`
  );

  return res.data;
};