import axios from 'axios';

// Base URL for backend
const BASE_URL = 'http://localhost:5000/api/users';

// Login API
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, { email, password });
    // JWT token store karna localStorage me
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};

// Register API
export const registerUser = async (name, email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, { name, email, password });
    return res.data;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};
// Fetch active roadside request
export const getActiveRequestApi = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/requests/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Fetch service history
export const getHistoryApi = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/requests/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Fetch notifications
export const getNotificationsApi = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
