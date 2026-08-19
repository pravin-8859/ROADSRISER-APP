import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleInput = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post(
        "/admin/login",
        {
          email: form.email
            .trim()
            .toLowerCase(),
          password: form.password,
        }
      );

      const token =
        res.data?.accessToken ||
        res.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token not received."
        );
      }

      localStorage.setItem(
        "adminAccessToken",
        token
      );

      localStorage.setItem(
        "role",
        "admin"
      );

      if (res.data?.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(res.data.admin)
        );
      }

      navigate("/admin", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* LOGIN CARD */}
      <div className="relative w-full max-w-md">

        <div className="bg-[#0f1523]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-7 sm:p-9">

          {/* LOGO */}
          <div className="flex justify-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">

              <span className="text-2xl font-black">
                R
              </span>

            </div>
          </div>

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              RoadsRiser Admin
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Sign in to manage your roadside
              assistance platform.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={form.email}
                placeholder="admin@roadsriser.com"
                autoComplete="email"
                onChange={(e) =>
                  handleInput(
                    "email",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3.5 rounded-xl bg-[#080d18] border border-white/10 text-white placeholder-gray-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onChange={(e) =>
                    handleInput(
                      "password",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3.5 pr-20 rounded-xl bg-[#080d18] border border-white/10 text-white placeholder-gray-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-white transition"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Authorized personnel only
            </p>

            <p className="text-xs text-gray-600 mt-1">
              © {new Date().getFullYear()} RoadsRiser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}