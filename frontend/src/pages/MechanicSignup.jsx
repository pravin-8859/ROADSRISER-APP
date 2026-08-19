import React, { useState } from "react";
import {
  sendOtp,
  registerMechanic,
} from "../api/mechanicApi";
import { useNavigate } from "react-router-dom";

import {
  FaTools,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaEnvelope,
  FaPhoneAlt,
  FaStore,
  FaLock,
  FaIdCard,
  FaUser,
  FaSpinner,
} from "react-icons/fa";

import logo from "../assets/logo.png";

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
      const cleanPhone = form.phone.replace(/\D/g, "");

      if (!/^\d{10}$/.test(cleanPhone)) {
        return "Phone number must contain 10 digits";
      }
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    if (form.gst.trim()) {
      const gst = form.gst.trim().toUpperCase();

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
    const validationError = validateStep1();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const email = form.email.trim().toLowerCase();

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
      console.error("Send OTP error:", err);

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

  const handleVerifyAndRegister = async () => {
    if (!form.otp.trim()) {
      setError("Enter OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: form.name.trim(),

        email: form.email
          .trim()
          .toLowerCase(),

        password: form.password,

        garageName: form.garageName.trim(),

        address: form.address.trim(),

        otp: form.otp.trim(),
      };

      const phone = form.phone.replace(/\D/g, "");

      if (/^\d{10}$/.test(phone)) {
        payload.phone = phone;
      }

      if (form.gst.trim()) {
        payload.gst = form.gst
          .trim()
          .toUpperCase();
      }

      const res = await registerMechanic(payload);

      if (!res?.data?.success) {
        throw new Error(
          res?.data?.message ||
            "Registration failed"
        );
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("mechanicProfile");

      nav("/auth/mechanic/login", {
        replace: true,
        state: {
          registered: true,
          email: form.email
            .trim()
            .toLowerCase(),
        },
      });
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

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 py-10 md:py-14 relative overflow-hidden">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-[-180px] left-[-150px] w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[-180px] right-[-150px] w-[450px] h-[450px] rounded-full bg-indigo-600/15 blur-[130px] pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />

      {/* MAIN */}

      <div className="relative max-w-6xl mx-auto">

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

            {/* =====================================
                LEFT PANEL
            ===================================== */}

            <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-blue-600/25 via-indigo-600/15 to-transparent border-r border-white/10 overflow-hidden">

              <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full border border-blue-400/10 pointer-events-none" />

              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-blue-400/10 pointer-events-none" />

              {/* LOGO */}

              <div className="relative">

                <div className="flex items-center gap-3 mb-10">

                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xl">
                    <img
                      src={logo}
                      alt="RoadsRiser"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold">
                      Roads
                      <span className="text-blue-400">
                        Riser
                      </span>
                    </h2>

                    <p className="text-[9px] tracking-[0.25em] text-gray-400">
                      ROADSIDE ASSISTANCE
                    </p>
                  </div>

                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold mb-5">

                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />

                  MECHANIC PARTNER PROGRAM

                </div>

                <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">
                  Grow your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    garage business.
                  </span>
                </h1>

                <p className="mt-5 text-gray-400 leading-7 max-w-md">
                  Join RoadsRiser and connect with drivers
                  who need reliable roadside assistance
                  near them.
                </p>

              </div>

              {/* BENEFITS */}

              <div className="relative mt-12 space-y-4">

                <Benefit
                  icon={<FaTools />}
                  title="More Service Requests"
                  desc="Connect with customers nearby."
                />

                <Benefit
                  icon={<FaMapMarkerAlt />}
                  title="Nearby Assistance"
                  desc="Get requests based on your location."
                />

                <Benefit
                  icon={<FaShieldAlt />}
                  title="Verified Platform"
                  desc="Professional and secure ecosystem."
                />

                <Benefit
                  icon={<FaClock />}
                  title="Work On Your Terms"
                  desc="Manage your availability yourself."
                />

              </div>

              <div className="relative mt-10 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-500">
                  "Your skills keep people moving.
                  RoadsRiser helps them find you."
                </p>
              </div>

            </div>

            {/* =====================================
                RIGHT FORM
            ===================================== */}

            <div className="p-6 sm:p-8 md:p-10 xl:p-12">

              {/* HEADER */}

              <div className="flex items-start justify-between gap-4 mb-8">

                <div>

                  <div className="lg:hidden flex items-center gap-3 mb-6">

                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">
                      <img
                        src={logo}
                        alt="RoadsRiser"
                        className="w-9 h-9 object-contain"
                      />
                    </div>

                    <div>
                      <h2 className="font-extrabold">
                        Roads
                        <span className="text-blue-400">
                          Riser
                        </span>
                      </h2>

                      <p className="text-[8px] tracking-[0.2em] text-gray-500">
                        ROADSIDE ASSISTANCE
                      </p>
                    </div>

                  </div>

                  <p className="text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                    Partner Registration
                  </p>

                  <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                    Create your account
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    Start receiving roadside service requests.
                  </p>

                </div>

                <div className="shrink-0 hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">
                  {step}/2
                </div>

              </div>

              {/* STEP INDICATOR */}

              <div className="flex items-center mb-8">

                <StepIndicator
                  number="1"
                  title="Details"
                  active={step === 1}
                  completed={step === 2}
                />

                <div
                  className={`flex-1 h-[2px] mx-3 ${
                    step === 2
                      ? "bg-blue-500"
                      : "bg-white/10"
                  }`}
                />

                <StepIndicator
                  number="2"
                  title="Verify"
                  active={step === 2}
                />

              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
                  <div className="flex items-start gap-3">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* =====================================
                  STEP 1
              ===================================== */}

              {step === 1 && (
                <div className="space-y-5">

                  <div className="grid sm:grid-cols-2 gap-4">

                    <InputField
                      icon={<FaUser />}
                      label="Full Name"
                      placeholder="Enter your name"
                      value={form.name}
                      disabled={loading}
                      onChange={(e) =>
                        handle(
                          "name",
                          e.target.value
                        )
                      }
                    />

                    <InputField
                      icon={<FaStore />}
                      label="Garage Name"
                      placeholder="Your garage name"
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

                  <InputField
                    icon={<FaEnvelope />}
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
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

                  <div className="grid sm:grid-cols-2 gap-4">

                    <InputField
                      icon={<FaPhoneAlt />}
                      label="Phone Number"
                      optional
                      placeholder="10 digit mobile number"
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

                    <InputField
                      icon={<FaIdCard />}
                      label="GST Number"
                      optional
                      placeholder="15 character GST"
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

                  <div className="grid sm:grid-cols-2 gap-4">

                    <InputField
                      icon={<FaLock />}
                      label="Password"
                      placeholder="Minimum 6 characters"
                      type="password"
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

                    <InputField
                      icon={<FaLock />}
                      label="Confirm Password"
                      placeholder="Re-enter password"
                      type="password"
                      value={form.confirmPassword}
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

                  {/* ADDRESS */}

                  <div>

                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Garage Address
                    </label>

                    <div className="relative">

                      <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-500 z-10 pointer-events-none" />

                      <textarea
                        placeholder="Enter your complete garage address"
                        className="signup-input signup-textarea"
                        value={form.address}
                        disabled={loading}
                        onChange={(e) =>
                          handle(
                            "address",
                            e.target.value
                          )
                        }
                      />

                    </div>

                  </div>

                  {/* SEND OTP */}

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Continue to Verification
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500 pt-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        nav(
                          "/auth/mechanic/login"
                        )
                      }
                      className="font-semibold text-blue-400 hover:text-blue-300 transition"
                    >
                      Login
                    </button>
                  </p>

                </div>
              )}

              {/* =====================================
                  STEP 2
              ===================================== */}

              {step === 2 && (
                <div className="space-y-6">

                  <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl">
                        <FaEnvelope />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-white">
                          Verify your email
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          OTP sent to
                        </p>

                        <p className="text-sm text-blue-400 font-medium break-all">
                          {form.email}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div>

                    <label className="block text-xs font-semibold text-gray-400 mb-2">
                      Enter Verification OTP
                    </label>

                    <div className="relative">

                      <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" />

                      <input
                        placeholder="Enter OTP"
                        className="signup-input signup-otp"
                        value={form.otp}
                        disabled={loading}
                        inputMode="numeric"
                        maxLength={6}
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

                    </div>

                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={
                      handleVerifyAndRegister
                    }
                    className="group w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/10 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Verify & Create Account
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3">

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
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.07] transition"
                    >
                      <FaArrowLeft />
                      Edit Details
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleSendOtp}
                      className="flex-1 py-3 rounded-xl border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition"
                    >
                      Resend OTP
                    </button>

                  </div>

                  {serverOtp && (
                    <div className="text-xs text-center text-yellow-400/70">
                      DEBUG OTP (dev only): {serverOtp}
                    </div>
                  )}

                  <p className="text-xs text-center text-gray-500">
                    By creating an account, you agree
                    to use RoadsRiser responsibly and
                    provide accurate garage information.
                  </p>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* TRUST */}

        <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-gray-500">

          <span className="flex items-center gap-2">
            <FaShieldAlt className="text-emerald-400" />
            Secure Registration
          </span>

          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-blue-400" />
            Verified Platform
          </span>

          <span className="flex items-center gap-2">
            <FaClock className="text-purple-400" />
            24/7 Support
          </span>

        </div>

      </div>

      {/* =========================================
          FIXED INPUT CSS
      ========================================= */}

      <style>{`

        .signup-input {
          box-sizing: border-box;
          width: 100%;
          height: 54px;

          /* IMPORTANT:
             Icon ke liye proper left space */
          padding: 13px 14px 13px 48px;

          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.10);

          background: rgba(255,255,255,0.035);

          color: #ffffff;
          outline: none;

          font-size: 15px;

          transition:
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .signup-input::placeholder {
          color: #64748b;
          opacity: 1;
        }

        .signup-input:hover {
          border-color: rgba(96,165,250,0.28);
        }

        .signup-input:focus {
          border-color: rgba(59,130,246,0.75);
          background: rgba(59,130,246,0.045);

          box-shadow:
            0 0 0 3px rgba(59,130,246,0.10);
        }

        .signup-input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ADDRESS */

        .signup-textarea {
          height: 104px;

          padding-top: 14px;

          /* Icon ke liye left space */
          padding-left: 48px;

          resize: none;

          line-height: 1.5;
        }

        /* OTP */

        .signup-otp {
          text-align: center;

          padding-left: 58px;
          padding-right: 20px;

          letter-spacing: 0.45em;

          font-weight: 700;
          font-size: 18px;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;

          -webkit-box-shadow:
            0 0 0px 1000px #0f172a inset;

          transition:
            background-color 5000s ease-in-out 0s;
        }

      `}</style>

    </div>
  );
}


/* =========================================
   INPUT COMPONENT
========================================= */

function InputField({
  icon,
  label,
  optional,
  ...props
}) {
  return (
    <div>

      <label className="block text-xs font-semibold text-gray-400 mb-2">
        {label}

        {optional && (
          <span className="ml-1 text-gray-600 font-normal">
            (optional)
          </span>
        )}
      </label>

      <div className="relative">

        {/* ICON */}

        <span
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            z-10
            text-gray-500
            pointer-events-none
            flex
            items-center
            justify-center
            w-4
            h-4
          "
        >
          {icon}
        </span>

        <input
          {...props}
          className="signup-input"
        />

      </div>

    </div>
  );
}


/* =========================================
   BENEFIT COMPONENT
========================================= */

function Benefit({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4">

      <div className="shrink-0 w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {desc}
        </p>
      </div>

    </div>
  );
}


/* =========================================
   STEP INDICATOR
========================================= */

function StepIndicator({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div className="flex items-center gap-2">

      <div
        className={`
          w-8
          h-8
          rounded-full
          flex
          items-center
          justify-center
          text-xs
          font-bold
          border
          transition-all

          ${
            active || completed
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-white/5 border-white/10 text-gray-500"
          }
        `}
      >
        {completed ? (
          <FaCheckCircle />
        ) : (
          number
        )}
      </div>

      <span
        className={`
          hidden sm:block
          text-xs
          font-semibold

          ${
            active || completed
              ? "text-gray-200"
              : "text-gray-600"
          }
        `}
      >
        {title}
      </span>

    </div>
  );
}