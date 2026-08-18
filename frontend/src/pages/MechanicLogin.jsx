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
    password: "",
  });

  const handle = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password.trim()) {
      setErr("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginMechanic({
        email,
        password,
      });

      const accessToken =
        res?.data?.accessToken ||
        res?.data?.token;

      if (!accessToken) {
        throw new Error("Access token not received from server");
      }

      // Store mechanic authentication
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("role", "mechanic");

      // Remove old user token if it exists
      localStorage.removeItem("token");

      // Backend mechanic data
      const mechanic = res?.data?.mechanic;

      if (mechanic) {
        const oldProfile = JSON.parse(
          localStorage.getItem("mechanicProfile") || "{}"
        );

        const mechanicProfile = {
          ...oldProfile,

          id: mechanic.id || mechanic._id || oldProfile.id || "",

          name:
            mechanic.name ||
            oldProfile.name ||
            "Mechanic",

          email:
            mechanic.email ||
            email,

          phone:
            mechanic.phone ||
            oldProfile.phone ||
            "",

          garageName:
            mechanic.garageName ||
            oldProfile.garageName ||
            "",

          gst:
            mechanic.gst ||
            oldProfile.gst ||
            "",

          address:
            mechanic.address ||
            oldProfile.address ||
            "",

          profilePhoto:
            mechanic.profilePhoto ||
            oldProfile.profilePhoto ||
            "",
        };

        localStorage.setItem(
          "mechanicProfile",
          JSON.stringify(mechanicProfile)
        );
      }

      nav("/mechanic/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error("Mechanic login error:", error);

      // Clean invalid authentication
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");

      setErr(
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-6">

      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border dark:border-gray-700">

        {/* HEADER */}
        <div className="text-center mb-6">

          <div className="flex justify-center items-center text-indigo-600 dark:text-indigo-400 text-4xl mb-3">
            <FaTools />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Mechanic Login
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Login to access your dashboard & jobs
          </p>

        </div>

        {/* ERROR */}
        {err && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-center text-sm font-medium">
              {err}
            </p>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email Address"
            className="input"
            value={form.email}
            onChange={(e) =>
              handle("email", e.target.value)
            }
            autoComplete="email"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={form.password}
            onChange={(e) =>
              handle("password", e.target.value)
            }
            autoComplete="current-password"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* SIGNUP LINK */}
        <div className="text-center mt-5 text-sm">

          <p className="text-gray-600 dark:text-gray-400">

            Don&apos;t have an account?{" "}

            <button
              type="button"
              disabled={loading}
              className="text-indigo-500 hover:text-indigo-600 font-medium"
              onClick={() =>
                nav("/auth/mechanic/signup")
              }
            >
              Create Account
            </button>

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
            box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
          }

          .input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn {
            background: linear-gradient(
              90deg,
              #6366f1,
              #06b6d4
            );

            padding: 12px 14px;
            border-radius: 10px;
            font-weight: 600;
            color: white;
            transition: 0.2s;
          }

          .btn:hover:not(:disabled) {
            opacity: 0.92;
          }

        `}</style>

      </div>
    </div>
  );
}