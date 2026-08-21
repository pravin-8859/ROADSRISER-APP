import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaShieldAlt,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

import API from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [cooldown, setCooldown] = useState(0);


  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };


  const startCooldown = () => {
    setCooldown(60);

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };


  // =====================================================
  // SEND RESET OTP
  // =====================================================

  const sendOtp = async () => {
    const email = form.email
      .trim()
      .toLowerCase();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (cooldown > 0) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post(
        "/users/forgot-password/send-otp",
        {
          email,
        }
      );

      setForm((prev) => ({
        ...prev,
        email,
      }));

      setStep(2);

      setSuccess(
        "If this email is registered, an OTP has been sent."
      );

      startCooldown();

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // VERIFY OTP
  // =====================================================

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(form.otp.trim())) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await API.post(
        "/users/forgot-password/verify-otp",
        {
          email:
            form.email.trim().toLowerCase(),

          otp: form.otp.trim(),
        }
      );

      if (!res.data?.resetToken) {
        throw new Error(
          "Reset session could not be created."
        );
      }

      setResetToken(
        res.data.resetToken
      );

      setStep(3);

      setSuccess(
        "OTP verified. You can now create a new password."
      );

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const resetPassword = async () => {
    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (!resetToken) {
      setError(
        "Password reset session expired. Please start again."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post(
        "/users/forgot-password/reset",
        {
          email:
            form.email.trim().toLowerCase(),

          resetToken,

          password:
            form.password,
        }
      );

      setSuccess(
        "Password changed successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/user/login", {
          replace: true,
        });
      }, 1500);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      py-28
      bg-[#020617]
      relative
      overflow-hidden
    ">

      <div className="
        absolute
        w-96
        h-96
        bg-indigo-600/20
        rounded-full
        blur-3xl
        -top-32
        -left-32
      " />

      <div className="
        absolute
        w-96
        h-96
        bg-blue-600/20
        rounded-full
        blur-3xl
        -bottom-32
        -right-32
      " />


      <div className="
        relative
        z-10
        w-full
        max-w-lg
        bg-slate-900/80
        backdrop-blur-2xl
        border
        border-white/10
        rounded-3xl
        shadow-2xl
        p-7
        sm:p-10
      ">

        {/* HEADER */}

        <div className="text-center mb-8">

          <div className="
            mx-auto
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-indigo-500
            to-blue-600
            text-white
            shadow-lg
            shadow-blue-500/30
            mb-5
          ">

            {step === 1 && (
              <FaEnvelope className="text-2xl" />
            )}

            {step === 2 && (
              <FaShieldAlt className="text-2xl" />
            )}

            {step === 3 && (
              <FaLock className="text-2xl" />
            )}

          </div>


          <h1 className="
            text-3xl
            sm:text-4xl
            font-extrabold
            text-white
          ">
            {step === 1 &&
              "Forgot Password"}

            {step === 2 &&
              "Verify OTP"}

            {step === 3 &&
              "Create New Password"}
          </h1>


          <p className="
            text-sm
            text-slate-400
            mt-2
          ">
            {step === 1 &&
              "Enter your registered email to receive a verification OTP."}

            {step === 2 &&
              `Enter the OTP sent to ${form.email}`}

            {step === 3 &&
              "Choose a strong password for your RoadsRiser account."}
          </p>

        </div>


        {/* PROGRESS */}

        <div className="
          flex
          justify-center
          gap-3
          mb-8
        ">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`
                h-2
                w-16
                rounded-full
                ${
                  step >= item
                    ? "bg-blue-500"
                    : "bg-slate-700"
                }
              `}
            />
          ))}

        </div>


        {/* ERROR */}

        {error && (
          <div className="
            mb-5
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-300
          ">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="
            mb-5
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            px-4
            py-3
            text-sm
            text-emerald-300
            flex
            gap-2
            items-center
          ">
            <FaCheckCircle />
            {success}
          </div>
        )}


        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (
          <div className="space-y-5">

            <Input
              icon={<FaEnvelope />}
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />


            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-gradient-to-r
                from-indigo-600
                to-blue-600
                py-3.5
                text-white
                font-semibold
                hover:from-indigo-500
                hover:to-blue-500
                transition
                disabled:opacity-50
              "
            >
              {loading
                ? "Sending OTP..."
                : "Send Verification OTP"}
            </button>

          </div>
        )}


        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (
          <div className="space-y-5">

            <Input
              icon={<FaShieldAlt />}
              name="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChange={handleChange}
              disabled={loading}
              maxLength={6}
            />


            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-gradient-to-r
                from-indigo-600
                to-blue-600
                py-3.5
                text-white
                font-semibold
                hover:from-indigo-500
                hover:to-blue-500
                transition
                disabled:opacity-50
              "
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>


            <div className="
              flex
              gap-3
            ">

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setSuccess("");
                }}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-slate-800
                  py-3
                  text-slate-300
                  hover:bg-slate-700
                "
              >
                Change Email
              </button>


              <button
                type="button"
                onClick={sendOtp}
                disabled={
                  loading ||
                  cooldown > 0
                }
                className="
                  flex-1
                  rounded-xl
                  border
                  border-blue-500/30
                  bg-blue-500/10
                  py-3
                  text-blue-300
                  disabled:opacity-40
                "
              >
                {cooldown > 0
                  ? `Resend ${cooldown}s`
                  : "Resend OTP"}
              </button>

            </div>

          </div>
        )}


        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (
          <div className="space-y-5">

            <Input
              icon={<FaLock />}
              name="password"
              type="password"
              placeholder="New password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              icon={<FaLock />}
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />


            <button
              type="button"
              onClick={resetPassword}
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-gradient-to-r
                from-indigo-600
                to-blue-600
                py-3.5
                text-white
                font-semibold
                hover:from-indigo-500
                hover:to-blue-500
                transition
                disabled:opacity-50
              "
            >
              {loading
                ? "Updating Password..."
                : "Reset Password"}
            </button>

          </div>
        )}


        {/* LOGIN */}

        <div className="
          text-center
          mt-8
          pt-6
          border-t
          border-white/10
        ">

          <Link
            to="/user/login"
            className="
              inline-flex
              items-center
              gap-2
              text-blue-400
              hover:text-blue-300
              font-semibold
              text-sm
            "
          >
            <FaArrowLeft />
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// INPUT
// =====================================================

function Input({
  icon,
  name,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  maxLength,
}) {
  return (
    <div className="relative">

      <span className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-slate-500
        pointer-events-none
      ">
        {icon}
      </span>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-slate-800/70
          px-12
          py-3.5
          text-white
          placeholder:text-slate-500
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
          transition
          disabled:opacity-50
        "
      />

    </div>
  );
}