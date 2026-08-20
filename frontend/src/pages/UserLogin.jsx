import React, { useState } from "react";
import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import API from "../services/api";

import {
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaArrowRight,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaTools,
} from "react-icons/fa";

import logo from "../assets/logo.png";

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = form.email.trim().toLowerCase();

    if (!email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/users/login", {
        email,
        password: form.password,
      });

      const token = res?.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token not received"
        );
      }

      /*
       * =========================================
       * STORE USER AUTHENTICATION
       * =========================================
       */

      localStorage.setItem("token", token);
      localStorage.setItem("role", "user");

      // Remove stale mechanic authentication when switching to a user account.
      localStorage.removeItem("accessToken");

      /*
       * =========================================
       * STORE USER INFORMATION
       * =========================================
       */

      const user = res?.data?.user;

      if (user) {
        localStorage.setItem(
          "user_name",
          user.name || ""
        );

        localStorage.setItem(
          "user_email",
          user.email || email
        );

        localStorage.setItem(
          "user_id",
          user.id ||
            user._id ||
            ""
        );
      }

      /*
       * =========================================
       * REDIRECT LOGIC
       * =========================================
       *
       * If user came from:
       *
       * Home
       *   ↓
       * Request Assistance
       *   ↓
       * Login
       *
       * then after successful login:
       *
       *   ↓
       * /request-help
       *
       * Otherwise:
       *
       *   ↓
       * /user/dashboard
       */

      const redirectTo =
        location.state?.redirectTo ||
        "/user/dashboard";

      navigate(redirectTo, {
        replace: true,
      });

    } catch (err) {
      console.error(
        "User login:",
        err
      );

      /*
       * Remove invalid token only.
       *
       * Do not clear complete localStorage
       * because other application data may exist.
       */

      localStorage.removeItem("token");

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 py-10 md:py-14 relative overflow-hidden">

      {/* =========================================================
          BACKGROUND GLOW
      ========================================================= */}

      <div className="absolute top-[-180px] left-[-160px] w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />

      <div className="absolute bottom-[-180px] right-[-150px] w-[450px] h-[450px] rounded-full bg-indigo-600/20 blur-[140px] pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* =========================================================
          MAIN CARD
      ========================================================= */}

      <div className="relative max-w-6xl mx-auto">

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

            {/* =====================================================
                LEFT BRAND SECTION
            ===================================================== */}

            <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-blue-600/25 via-indigo-600/15 to-transparent border-r border-white/10 overflow-hidden">

              <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full border border-blue-400/10" />

              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-blue-400/10" />

              {/* BRAND */}

              <div className="relative">

                <div className="flex items-center gap-3 mb-12">

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

                    <p className="text-[9px] tracking-[0.25em] text-gray-500">
                      ROADSIDE ASSISTANCE
                    </p>

                  </div>

                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold mb-5">

                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                  WELCOME BACK

                </div>

                <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">

                  Back on the

                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    road again.
                  </span>

                </h1>

                <p className="mt-5 text-gray-400 leading-7 max-w-md">
                  Sign in to your RoadsRiser account
                  and manage your roadside assistance
                  requests, mechanics and services.
                </p>

              </div>

              {/* BENEFITS */}

              <div className="relative mt-12 space-y-5">

                <LoginBenefit
                  icon={<FaTools />}
                  title="Find Nearby Mechanics"
                  desc="Connect with trusted mechanics around you."
                />

                <LoginBenefit
                  icon={<FaShieldAlt />}
                  title="Secure Account"
                  desc="Your account and requests stay protected."
                />

                <LoginBenefit
                  icon={<FaClock />}
                  title="24/7 Assistance"
                  desc="Roadside support whenever you need it."
                />

              </div>

              <div className="relative mt-10 pt-8 border-t border-white/10">

                <p className="text-sm text-gray-500 leading-relaxed">
                  "Wherever the road takes you,
                  RoadsRiser is ready to help."
                </p>

              </div>

            </div>

            {/* =====================================================
                RIGHT LOGIN FORM
            ===================================================== */}

            <div className="p-6 sm:p-8 md:p-10 xl:p-12">

              {/* MOBILE BRAND */}

              <div className="lg:hidden flex items-center gap-3 mb-10">

                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">

                  <img
                    src={logo}
                    alt="RoadsRiser"
                    className="w-9 h-9 object-contain"
                  />

                </div>

                <div>

                  <h2 className="font-extrabold text-lg">
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

              {/* HEADER */}

              <div className="mb-8">

                <p className="text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                  Welcome Back
                </p>

                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                  User Login
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Login to continue to your RoadsRiser
                  dashboard.
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">

                  <div className="flex items-start gap-3">

                    <span className="text-red-400">
                      ⚠
                    </span>

                    <p className="text-sm text-red-300">
                      {error}
                    </p>

                  </div>

                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Email Address
                  </label>

                  <div className="relative">

                    <FaEnvelope
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        z-10
                        pointer-events-none
                      "
                    />

                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      disabled={loading}
                      className="user-login-input"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Password
                  </label>

                  <div className="relative">

                    <FaLock
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        z-10
                        pointer-events-none
                      "
                    />

                    <input
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      disabled={loading}
                      className="user-login-input"
                    />

                  </div>

                </div>

                {/* FORGOT PASSWORD */}

                <div className="flex justify-end">

                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot Password?
                  </Link>

                </div>

                {/* LOGIN */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-3
                    py-3.5
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    text-white
                    font-bold
                    shadow-lg
                    shadow-blue-600/20
                    hover:shadow-blue-600/40
                    hover:scale-[1.01]
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition-all
                  "
                >

                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login to Account
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}

                </button>

              </form>

              {/* DIVIDER */}

              <div className="flex items-center gap-4 my-8">

                <div className="flex-1 h-px bg-white/10" />

                <span className="text-xs text-gray-600">
                  OR
                </span>

                <div className="flex-1 h-px bg-white/10" />

              </div>

              {/* CREATE ACCOUNT */}

              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.025] text-center">

                <p className="text-sm text-gray-400 mb-3">
                  Don't have a RoadsRiser account?
                </p>

                <Link
                  to="/user/signup"
                  state={{
                    redirectTo:
                      location.state?.redirectTo ||
                      "/user/dashboard",
                  }}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    py-2.5
                    rounded-xl
                    border
                    border-blue-500/30
                    bg-blue-500/5
                    text-blue-400
                    text-sm
                    font-semibold
                    hover:bg-blue-500/10
                    hover:border-blue-500/50
                    transition
                  "
                >
                  Create Account
                  <FaArrowRight className="text-xs" />
                </Link>

              </div>

              {/* TRUST */}

              <div className="mt-8 pt-7 border-t border-white/10">

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-gray-500">

                  <span className="flex items-center gap-2">
                    <FaShieldAlt className="text-emerald-400" />
                    Secure Login
                  </span>

                  <span className="flex items-center gap-2">
                    <FaCheckCircle className="text-blue-400" />
                    Trusted Platform
                  </span>

                  <span className="flex items-center gap-2">
                    <FaClock className="text-purple-400" />
                    24/7 Support
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          INPUT STYLES
      ========================================================= */}

      <style>{`

        .user-login-input {
          box-sizing: border-box;
          width: 100%;
          height: 56px;
          padding: 13px 15px 13px 50px;
          border-radius: 13px;
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

        .user-login-input::placeholder {
          color: #64748b;
          opacity: 1;
        }

        .user-login-input:hover {
          border-color: rgba(96,165,250,0.30);
        }

        .user-login-input:focus {
          border-color: rgba(59,130,246,0.75);
          background: rgba(59,130,246,0.045);
          box-shadow:
            0 0 0 3px rgba(59,130,246,0.10);
        }

        .user-login-input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
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


/* =========================================================
   BENEFIT COMPONENT
========================================================= */

function LoginBenefit({
  icon,
  title,
  desc,
}) {
  return (
    <div className="flex items-center gap-4">

      <div
        className="
          shrink-0
          w-11
          h-11
          rounded-xl
          bg-white/5
          border
          border-white/10
          flex
          items-center
          justify-center
          text-blue-400
        "
      >
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