// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginApi } from "../api/adminApi";

export default function AdminLogin() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLoginApi(form.email, form.password);
      // backend should return token
      localStorage.setItem("adminToken", res.token);
      localStorage.setItem("role", "admin");
      alert(res.message || "Login successful");
      nav("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Admin Login</h2>
        <form onSubmit={submit} className="space-y-4">
          <input name="email" value={form.email} onChange={handle} required type="email"
            className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="admin@you.com" />
          <input name="password" value={form.password} onChange={handle} required type="password"
            className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="Password" />
          <button disabled={loading}
            className="w-full py-2 rounded-md bg-indigo-600 text-white font-semibold">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
