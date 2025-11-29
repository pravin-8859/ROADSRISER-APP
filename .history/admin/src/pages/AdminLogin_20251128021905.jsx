import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInput = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/admin/login", form);

      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_name", res.data.name);

      navigate("/admin"); // redirect
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Incorrect credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
        
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Admin Login
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/20 text-red-300 text-sm border border-red-400/40">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:border-indigo-500"
            value={form.email}
            onChange={(e) => handleInput("email", e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg outline-none border border-gray-600 focus:border-indigo-500"
            value={form.password}
            onChange={(e) => handleInput("password", e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          RoadsRiser Admin Panel • Secure Access
        </p>
      </div>
    </div>
  );
}
