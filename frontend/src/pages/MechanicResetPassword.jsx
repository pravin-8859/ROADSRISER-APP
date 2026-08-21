import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  verifyMechanicResetOtp,
  resetMechanicPassword,
  sendMechanicResetOtp,
} from "../api/mechanicApi";

import {
  FaTools,
  FaLock,
  FaKey,
  FaArrowLeft,
} from "react-icons/fa";


export default function MechanicResetPassword() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const email =
    searchParams.get("email") || "";


  const [otp, setOtp] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [verified, setVerified] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [resending, setResending] =
    useState(false);


  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError(
        "Email information is missing. Please request OTP again."
      );
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(
        "Please enter a valid 6-digit OTP."
      );
      return;
    }

    try {
      setVerifying(true);

      await verifyMechanicResetOtp(
        email,
        otp
      );

      setVerified(true);

      setSuccess(
        "OTP verified. You can now create a new password."
      );

    } catch (err) {
      console.error(
        "Verify mechanic reset OTP:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Invalid or expired OTP."
      );

    } finally {
      setVerifying(false);
    }
  };


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!verified) {
      setError(
        "Please verify the OTP first."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await resetMechanicPassword(
        email,
        otp,
        password
      );

      setSuccess(
        "Password reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate(
          "/auth/mechanic/login",
          {
            replace: true,
          }
        );
      }, 1500);

    } catch (err) {
      console.error(
        "Reset mechanic password:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to reset password."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError(
        "Email information is missing."
      );
      return;
    }

    try {
      setResending(true);

      await sendMechanicResetOtp(
        email
      );

      setOtp("");
      setVerified(false);

      setSuccess(
        "A new OTP has been sent to your email."
      );

    } catch (err) {
      console.error(
        "Resend mechanic OTP:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to resend OTP."
      );

    } finally {
      setResending(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 py-24">

      <div className="w-full max-w-md">

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">

          {/* ICON */}

          <div className="flex justify-center mb-6">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg">

              <FaTools className="text-2xl" />

            </div>

          </div>


          {/* HEADER */}

          <div className="text-center mb-8">

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">

              Reset Password

            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 break-all">

              {email || "Mechanic account"}

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


          {!email ? (
            <div className="text-center">

              <p className="text-gray-600 dark:text-gray-400 mb-5">

                Please request a new password reset OTP.

              </p>

              <Link
                to="/mechanic/forgot-password"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >

                Request OTP

              </Link>

            </div>
          ) : (
            <>
              {/* =================================================
                  OTP
              ================================================= */}

              <div className="space-y-4">

                <div>

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">

                    Verification OTP

                  </label>

                  <div className="relative">

                    <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setOtp(value);
                        setError("");
                        setVerified(false);
                      }}
                      placeholder="Enter 6-digit OTP"
                      disabled={verified}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                </div>


                {!verified && (
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={
                      verifying ||
                      otp.length !== 6
                    }
                    className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold disabled:opacity-50"
                  >

                    {verifying
                      ? "Verifying..."
                      : "Verify OTP"}

                  </button>
                )}


                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                >

                  {resending
                    ? "Sending..."
                    : "Didn't receive OTP? Resend"}

                </button>

              </div>


              {/* =================================================
                  NEW PASSWORD
              ================================================= */}

              {verified && (
                <form
                  onSubmit={handleResetPassword}
                  className="mt-7 space-y-5"
                >

                  <div>

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">

                      New Password

                    </label>

                    <div className="relative">

                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(
                            e.target.value
                          );
                          setError("");
                        }}
                        placeholder="Minimum 6 characters"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />

                    </div>

                  </div>


                  <div>

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">

                      Confirm Password

                    </label>

                    <div className="relative">

                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(
                            e.target.value
                          );
                          setError("");
                        }}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />

                    </div>

                  </div>


                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg hover:from-indigo-500 hover:to-blue-400 transition disabled:opacity-60"
                  >

                    {loading
                      ? "Updating Password..."
                      : "Reset Password"}

                  </button>

                </form>
              )}
            </>
          )}


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