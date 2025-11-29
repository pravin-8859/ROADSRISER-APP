import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login", form); // backend: POST /api/admin/login
      // backend should return { accessToken, admin: {..} }
      const token = res.data?.accessToken || res.data?.token;
      if (token) {
        localStorage.setItem("adminAccessToken", token);
        localStorage.setItem("adminEmail", res.data?.admin?.email || form.email);
        nav("/");
      } else throw new Error("No token returned");
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <input name="email" onChange={handle} required placeholder="Email" className="w-full px-3 py-2 border rounded" />
          <input name="password" type="password" onChange={handle} required placeholder="Password" className="w-full px-3 py-2 border rounded" />
          <button className="w-full py-2 bg-indigo-600 text-white rounded" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
