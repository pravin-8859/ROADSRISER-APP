import React, { useState } from "react";
import { loginMechanic } from "../api/mechanicApi";
import { useNavigate } from "react-router-dom";
import { FaTools } from "react-icons/fa";

export default function MechanicLogin() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handle = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));
    setErr("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");

  if (!form.email.trim() || !form.password.trim()) {
    return setErr("Please enter email and password");
  }

  try {
    setLoading(true);
    const res = await loginMechanic(form);

    // FIXED 🔥 → same key as user login
    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("role", "mechanic");

    // OPTIONAL: save mechanic name for navbar display
    if (res.data?.mechanic?.name) {
      localStorage.setItem("mechanic_name", res.data.mechanic.name);
    }

    setLoading(false);
    nav("/mechanic/dashboard");
  } catch (error) {
    setLoading(false);
    setErr(error.response?.data?.message || "Invalid email or password");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-6">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border dark:border-gray-700">

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 text-indigo-600 dark:text-indigo-400 text-4xl mb-3">
            <FaTools />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Mechanic Login
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Login to access your dashboard & jobs
          </p>
        </div>

        {/* Error Message */}
        {err && (
          <p className="text-red-500 text-center mb-4 text-sm font-medium">
            {err}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            className="input"
            value={form.email}
            onChange={(e) => handle("email", e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={form.password}
            onChange={(e) => handle("password", e.target.value)}
          />

          <button type="submit" className="btn w-full">
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Bottom Links */}
        <div className="text-center mt-4 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <span
              className="text-indigo-500 cursor-pointer"
              onClick={() => nav("/auth/mechanic/signup")}
            >
              Create Account
            </span>
          </p>
        </div>

        <style>{`
          .input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #d1d5db;
            background: transparent;
            color: inherit;
          }
          .input:focus {
            border-color: #6366f1;
            outline: none;
          }
          .btn {
            background: linear-gradient(90deg,#6366f1,#06b6d4);
            padding: 12px 14px;
            border-radius: 10px;
            font-weight: 600;
            color: white;
          }
        `}</style>

      </div>
    </div>
  );
}
