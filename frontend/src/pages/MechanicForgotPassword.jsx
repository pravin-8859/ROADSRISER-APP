import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  sendMechanicResetOtp,
} from "../api/mechanicApi";

import {
  FaTools,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";


export default function MechanicForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await sendMechanicResetOtp(
        cleanEmail
      );

      /*
        Keep same email in URL so reset page
        knows which account is being reset.
      */

      navigate(
        `/mechanic/reset-password?email=${encodeURIComponent(
          cleanEmail
        )}`
      );

    } catch (err) {
      console.error(
        "Mechanic forgot password:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 py-24">

      <div className="w-full max-w-md">

        {/* CARD */}

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">

          {/* ICON */}

          <div className="flex justify-center mb-6">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg">

              <FaTools className="text-2xl" />

            </div>

          </div>


          {/* TITLE */}

          <div className="text-center mb-8">

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">

              Forgot Password?

            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">

              Enter your registered mechanic email
              and we'll send you an OTP.

            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3">

              <p className="text-sm text-red-600 dark:text-red-400 text-center">

                {error}

              </p>

            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="mb-5 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 px-4 py-3">

              <p className="text-sm text-green-600 dark:text-green-400 text-center">

                {success}

              </p>

            </div>
          )}


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">

                Email Address

              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="mechanic@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />

              </div>

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg hover:from-indigo-500 hover:to-blue-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {loading
                ? "Sending OTP..."
                : "Send OTP"}

            </button>

          </form>


          {/* BACK */}

          <div className="mt-7 text-center">

            <Link
              to="/auth/mechanic/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >

              <FaArrowLeft />

              Back to Mechanic Login

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}