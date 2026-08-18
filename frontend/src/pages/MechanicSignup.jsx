import React, { useState } from "react";
import {
  sendOtp,
  registerMechanic,
} from "../api/mechanicApi";
import { useNavigate } from "react-router-dom";

export default function MechanicSignup() {

  const nav = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverOtp, setServerOtp] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gst: "",
    garageName: "",
    address: "",
    otp: "",
  });

  const handle = (key, value) => {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setError("");
  };

  /* =========================
       STEP 1 VALIDATION
  ========================= */

  const validateStep1 = () => {

    if (!form.name.trim()) {
      return "Enter your full name";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Enter a valid email";
    }

    if (form.phone.trim()) {

      const cleanPhone =
        form.phone.replace(/\D/g, "");

      if (!/^\d{10}$/.test(cleanPhone)) {
        return "Phone number must contain 10 digits";
      }
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      return "Passwords do not match";
    }

    if (form.gst.trim()) {

      const gst =
        form.gst.trim().toUpperCase();

      if (!/^[0-9A-Z]{15}$/.test(gst)) {
        return "GST number should be 15 characters";
      }
    }

    return null;
  };

  /* =========================
          SEND OTP
  ========================= */

  const handleSendOtp = async () => {

    const validationError =
      validateStep1();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      setLoading(true);
      setError("");

      const email =
        form.email
          .trim()
          .toLowerCase();

      const res = await sendOtp({
        email,
        purpose: "signup",
      });

      const debugOtp =
        res?.data?.debugOtp ||
        res?.data?.otp ||
        null;

      if (debugOtp) {
        setServerOtp(String(debugOtp));
      } else {
        setServerOtp(null);
      }

      setStep(2);

    } catch (err) {

      console.error(
        "Send OTP error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to send OTP. Try again."
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================
       VERIFY + REGISTER
  ========================= */

  const handleVerifyAndRegister =
    async () => {

      if (!form.otp.trim()) {
        setError("Enter OTP");
        return;
      }

      try {

        setLoading(true);
        setError("");

        const payload = {

          name:
            form.name.trim(),

          email:
            form.email
              .trim()
              .toLowerCase(),

          password:
            form.password,

          garageName:
            form.garageName.trim(),

          address:
            form.address.trim(),

          otp:
            form.otp.trim(),
        };

        /* PHONE */

        const phone =
          form.phone.replace(/\D/g, "");

        if (/^\d{10}$/.test(phone)) {
          payload.phone = phone;
        }

        /* GST */

        if (form.gst.trim()) {
          payload.gst =
            form.gst
              .trim()
              .toUpperCase();
        }

        const res =
          await registerMechanic(payload);

        if (!res?.data?.success) {
          throw new Error(
            res?.data?.message ||
            "Registration failed"
          );
        }

        /*
         IMPORTANT:
         Signup ke baad accessToken/role save
         nahi karenge.

         User ko proper login karna hoga.
        */

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "role"
        );

        localStorage.removeItem(
          "mechanicProfile"
        );

        nav(
          "/auth/mechanic/login",
          {
            replace: true,
            state: {
              registered: true,
              email:
                form.email
                  .trim()
                  .toLowerCase(),
            },
          }
        );

      } catch (err) {

        console.error(
          "Mechanic signup error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Signup failed. Try again."
        );

      } finally {

        setLoading(false);
      }
    };

  /* =========================
            UI
  ========================= */

  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-4 py-10">

      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT SECTION */}

          <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-10">

            <h2 className="text-3xl font-bold mb-4">
              Join RoadsRiser
            </h2>

            <p className="text-sm opacity-90 mb-8">
              Get more jobs, manage customers
              professionally and grow your garage.
            </p>

            <ul className="space-y-3 text-sm opacity-95">

              <li>✔ Priority Requests</li>

              <li>
                ✔ Garage Profile Management
              </li>

              <li>
                ✔ Roadside Assistance Jobs
              </li>

              <li>
                ✔ Ratings & Reviews
              </li>

            </ul>

          </div>

          {/* RIGHT SECTION */}

          <div className="p-8 md:p-10">

            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Mechanic Signup
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Create your mechanic account to
              start receiving service requests.
            </p>

            {/* ERROR */}

            {error && (

              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">

                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </p>

              </div>

            )}

            {/* STEP 1 */}

            {step === 1 && (

              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    placeholder="Full Name"
                    className="input"
                    value={form.name}
                    disabled={loading}
                    onChange={(e) =>
                      handle(
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Garage Name"
                    className="input"
                    value={form.garageName}
                    disabled={loading}
                    onChange={(e) =>
                      handle(
                        "garageName",
                        e.target.value
                      )
                    }
                  />

                </div>

                <input
                  placeholder="Email"
                  type="email"
                  className="input"
                  value={form.email}
                  disabled={loading}
                  autoComplete="email"
                  onChange={(e) =>
                    handle(
                      "email",
                      e.target.value
                    )
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    placeholder="Phone Number (optional)"
                    className="input"
                    value={form.phone}
                    disabled={loading}
                    inputMode="numeric"
                    maxLength={10}
                    onChange={(e) =>
                      handle(
                        "phone",
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                  />

                  <input
                    placeholder="GST Number (optional)"
                    className="input"
                    value={form.gst}
                    disabled={loading}
                    maxLength={15}
                    onChange={(e) =>
                      handle(
                        "gst",
                        e.target.value.toUpperCase()
                      )
                    }
                  />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    placeholder="Password"
                    type="password"
                    className="input"
                    value={form.password}
                    disabled={loading}
                    autoComplete="new-password"
                    onChange={(e) =>
                      handle(
                        "password",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Confirm Password"
                    type="password"
                    className="input"
                    value={
                      form.confirmPassword
                    }
                    disabled={loading}
                    autoComplete="new-password"
                    onChange={(e) =>
                      handle(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                  />

                </div>

                <textarea
                  placeholder="Complete Garage Address"
                  className="input h-24 resize-none"
                  value={form.address}
                  disabled={loading}
                  onChange={(e) =>
                    handle(
                      "address",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="btn w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Sending OTP..."
                    : "Send OTP"}
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">

                  Already have an account?{" "}

                  <button
                    type="button"
                    onClick={() =>
                      nav(
                        "/auth/mechanic/login"
                      )
                    }
                    className="text-indigo-600 dark:text-indigo-400 font-medium"
                  >
                    Login
                  </button>

                </p>

              </div>
            )}

            {/* STEP 2 */}

            {step === 2 && (

              <div className="space-y-4">

                <p className="text-gray-600 dark:text-gray-400 text-sm">

                  OTP sent to{" "}

                  <strong>
                    {form.email}
                  </strong>

                </p>

                <div className="flex gap-3">

                  <input
                    placeholder="Enter OTP"
                    className="input"
                    value={form.otp}
                    disabled={loading}
                    inputMode="numeric"
                    onChange={(e) =>
                      handle(
                        "otp",
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setStep(1);
                      setError("");
                      setForm((prev) => ({
                        ...prev,
                        otp: "",
                      }));
                    }}
                    className="px-4 py-2 border rounded-lg dark:border-gray-600"
                  >
                    Edit
                  </button>

                </div>

                <button
                  type="button"
                  disabled={loading}
                  className="btn w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={
                    handleVerifyAndRegister
                  }
                >
                  {loading
                    ? "Creating Account..."
                    : "Verify & Create Account"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSendOtp}
                  className="w-full text-sm text-indigo-500 disabled:opacity-50"
                >
                  Resend OTP
                </button>

                {/* DEV ONLY */}

                {serverOtp && (

                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">

                    DEBUG OTP (dev only):{" "}
                    {serverOtp}

                  </div>

                )}

              </div>
            )}

          </div>

        </div>

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
  );
}