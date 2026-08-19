import React, { useState } from "react";
import { loginMechanic } from "../api/mechanicApi";
import { useNavigate } from "react-router-dom";

import {
  FaTools,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";

import logo from "../assets/logo.png";

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
        throw new Error(
          "Access token not received from server"
        );
      }

      // =========================
      // STORE AUTHENTICATION
      // =========================

      localStorage.setItem(
        "accessToken",
        accessToken
      );

      localStorage.setItem(
        "role",
        "mechanic"
      );

      localStorage.removeItem("token");

      // =========================
      // STORE MECHANIC PROFILE
      // =========================

      const mechanic = res?.data?.mechanic;

      if (mechanic) {
        const oldProfile = JSON.parse(
          localStorage.getItem(
            "mechanicProfile"
          ) || "{}"
        );

        const mechanicProfile = {
          ...oldProfile,

          id:
            mechanic.id ||
            mechanic._id ||
            oldProfile.id ||
            "",

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
          JSON.stringify(
            mechanicProfile
          )
        );
      }

      nav("/mechanic/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Mechanic login error:",
        error
      );

      localStorage.removeItem(
        "accessToken"
      );

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
    <div className="min-h-screen bg-[#020617] text-white px-4 py-10 md:py-14 relative overflow-hidden">

      {/* =================================
          BACKGROUND GLOW
      ================================= */}

      <div className="absolute top-[-180px] left-[-150px] w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />

      <div className="absolute bottom-[-180px] right-[-150px] w-[450px] h-[450px] rounded-full bg-indigo-600/20 blur-[140px] pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* =================================
          MAIN CONTAINER
      ================================= */}

      <div className="relative max-w-6xl mx-auto">

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

            {/* =================================
                LEFT BRAND PANEL
            ================================= */}

            <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-blue-600/25 via-indigo-600/15 to-transparent border-r border-white/10 overflow-hidden">

              {/* Decorative circles */}

              <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full border border-blue-400/10 pointer-events-none" />

              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-blue-400/10 pointer-events-none" />

              {/* LOGO */}

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

                {/* BADGE */}

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-5">

                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />

                  MECHANIC PORTAL

                </div>

                <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">

                  Welcome
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    back, partner.
                  </span>

                </h1>

                <p className="mt-5 text-gray-400 leading-7 max-w-md">
                  Manage your roadside assistance
                  requests, connect with customers,
                  and grow your garage business with
                  RoadsRiser.
                </p>

              </div>

              {/* FEATURES */}

              <div className="relative mt-12 space-y-5">

                <LoginBenefit
                  icon={<FaTools />}
                  title="Manage Your Jobs"
                  desc="View and handle roadside requests."
                />

                <LoginBenefit
                  icon={<FaShieldAlt />}
                  title="Secure Access"
                  desc="Your mechanic account stays protected."
                />

                <LoginBenefit
                  icon={<FaClock />}
                  title="24/7 Assistance"
                  desc="Stay connected with customers anytime."
                />

              </div>

              {/* QUOTE */}

              <div className="relative mt-10 pt-8 border-t border-white/10">

                <p className="text-sm text-gray-500 leading-relaxed">
                  "Every successful repair starts
                  with someone willing to help."
                </p>

              </div>

            </div>

            {/* =================================
                RIGHT LOGIN PANEL
            ================================= */}

            <div className="p-6 sm:p-8 md:p-10 xl:p-12">

              {/* MOBILE LOGO */}

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

                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-5">

                  <FaTools />

                </div>

                <p className="text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                  Mechanic Login
                </p>

                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Login to access your dashboard
                  and manage your jobs.
                </p>

              </div>

              {/* ERROR */}

              {err && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">

                  <div className="flex items-start gap-3">

                    <span className="text-red-400">
                      ⚠
                    </span>

                    <p className="text-sm text-red-300">
                      {err}
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

                <LoginInput
                  icon={<FaEnvelope />}
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
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

                {/* PASSWORD */}

                <LoginInput
                  icon={<FaLock />}
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  disabled={loading}
                  autoComplete="current-password"
                  onChange={(e) =>
                    handle(
                      "password",
                      e.target.value
                    )
                  }
                />

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
                >

                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login to Dashboard

                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}

                </button>

              </form>

              {/* SIGNUP */}

              <div className="text-center mt-7">

                <p className="text-sm text-gray-500">

                  Don't have a mechanic account?{" "}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      nav(
                        "/auth/mechanic/signup"
                      )
                    }
                    className="font-semibold text-blue-400 hover:text-blue-300 transition"
                  >
                    Create Account
                  </button>

                </p>

              </div>

              {/* TRUST */}

              <div className="mt-10 pt-7 border-t border-white/10">

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-gray-500">

                  <span className="flex items-center gap-2">
                    <FaShieldAlt className="text-emerald-400" />
                    Secure Login
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

            </div>

          </div>

        </div>

      </div>

      {/* =================================
          FIXED INPUT CSS
      ================================= */}

      <style>{`

        .mechanic-login-input {
          box-sizing: border-box;

          width: 100%;
          height: 56px;

          /*
            IMPORTANT:
            Icon ke liye proper left space
          */
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

        .mechanic-login-input::placeholder {
          color: #64748b;
          opacity: 1;
        }

        .mechanic-login-input:hover {
          border-color: rgba(96,165,250,0.30);
        }

        .mechanic-login-input:focus {
          border-color: rgba(59,130,246,0.75);

          background: rgba(59,130,246,0.045);

          box-shadow:
            0 0 0 3px rgba(59,130,246,0.10);
        }

        .mechanic-login-input:disabled {
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


/* =========================================
   LOGIN INPUT
========================================= */

function LoginInput({
  icon,
  label,
  ...props
}) {
  return (
    <div>

      <label className="block text-xs font-semibold text-gray-400 mb-2">
        {label}
      </label>

      <div className="relative">

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
          className="mechanic-login-input"
        />

      </div>

    </div>
  );
}


/* =========================================
   LOGIN BENEFIT
========================================= */

function LoginBenefit({
  icon,
  title,
  desc,
}) {
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