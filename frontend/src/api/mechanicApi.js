import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Access token automatically attach hoga
API.interceptors.request.use(
  (req) => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ================= OTP =================

export const sendOtp = ({ email, phone, purpose = "signup" }) =>
  API.post("/otp/send", {
    email,
    phone,
    purpose,
  });

// ================= AUTH =================

export const registerMechanic = (payload) =>
  API.post("/mechanics/register", payload);

export const loginMechanic = async (data) => {
  const res = await API.post("/mechanics/login", data);

  const token =
    res.data?.accessToken ||
    res.data?.token ||
    res.data?.access;

  if (token) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", "mechanic");
  }

  return res;
};

export const logout = async () => {
  try {
    await API.post("/mechanics/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
};

// ================= MECHANIC REQUESTS =================

// Pending + assigned requests
export const getMechanicRequests = () =>
  API.get("/mechanics/requests");

// Accept request
export const acceptMechanicRequest = (id) =>
  API.put(`/mechanics/requests/${id}/accept`);

// Update request status
export const updateMechanicRequestStatus = (id, status) =>
  API.put(`/mechanics/requests/${id}/status`, {
    status,
  });

export default API;